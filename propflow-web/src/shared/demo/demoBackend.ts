// In-memory mock backend for the static GitHub Pages demo.
// Serves the exported database snapshot and simulates mutations in-session
// so the UI feels live. State resets on page reload.
//
// Bilingual demo: the dataset ships in English; for Spanish the demo store is
// rebuilt with `demo-overlay-es.json` translations applied to every matching
// string (notes, titles, descriptions). Derived labels (stages, weekdays,
// months) are not translated here — the UI resolves those through i18n.
import demoData from './demo-data.json';
import esOverlay from './demo-overlay-es.json';

type Any = Record<string, unknown>;
const clone = <T>(v: T): T =>
  typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));

// flat EN → ES lookup built from the overlay section map
const ES_STRINGS: Record<string, string> = (() => (
  Object.values(esOverlay as Record<string, Record<string, string>>)
    .reduce((acc, section) => Object.assign(acc, section), {})
))();

function translateStrings<T>(node: T): T {
  if (typeof node === 'string') {
    return (ES_STRINGS[node] ?? node) as unknown as T;
  }
  if (Array.isArray(node)) {
    return node.map((v) => translateStrings(v)) as unknown as T;
  }
  if (node && typeof node === 'object') {
    const out: Any = {};
    for (const [k, v] of Object.entries(node as Any)) out[k] = translateStrings(v);
    return out as unknown as T;
  }
  return node;
}

function resolveLang(): 'en' | 'es' {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    /* private mode */
  }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es')
    ? 'es'
    : 'en';
}

let currentLang: 'en' | 'es' = resolveLang();
let store: Any = currentLang === 'es' ? translateStrings(clone(demoData as unknown as Any)) : clone(demoData as unknown as Any);

/** Swap the demo dataset's language; in-session mutations reset (as they do on reload). */
export function setDemoLanguage(lang: 'en' | 'es') {
  if (lang === currentLang) return;
  currentLang = lang;
  store = lang === 'es' ? translateStrings(clone(demoData as unknown as Any)) : clone(demoData as unknown as Any);
}

// Demo records reference bundled photos as `asset:<path-under-public/images>`.
// Resolve them once to runtime URLs (honors the GitHub Pages base path).
const assetUrl = (v: unknown): string | undefined =>
  typeof v === 'string' && v.startsWith('asset:')
    ? `${import.meta.env.BASE_URL}images/${v.slice(6)}`
    : undefined;

for (const rec of [
  store.landlord as Any,
  ...(store.properties as Any[] | undefined ?? []),
  ...(store.rentalunits as Any[] | undefined ?? []),
  ...(store.tenants as Any[] | undefined ?? []),
  ...(store.leads as Any[] | undefined ?? []),
]) {
  if (!rec) continue;
  const u = assetUrl(rec.imageUrl);
  if (u) rec.imageUrl = u;
}

const uuid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

const COLLECTIONS: Record<string, string> = {
  leads: 'leads',
  properties: 'properties',
  rentalunits: 'rentalunits',
  tenants: 'tenants',
  contracts: 'contracts',
  payments: 'payments',
  maintenancerequests: 'maintenancerequests',
};

const arr = (name: string): Any[] => (store[name] as Any[]) || [];

export async function demoHandle<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const body: Any | undefined = options.body ? JSON.parse(options.body as string) : undefined;
  const path = endpoint.split('?')[0];
  const seg = path.split('/').filter(Boolean);

  // simulate a little latency so loading states show
  await new Promise((r) => setTimeout(r, 90));

  // ---- auth ----
  if (seg[0] === 'auth') {
    if (seg[1] === 'login' || seg[1] === 'register') {
      return { token: 'demo-token', landlord: store.landlord } as T;
    }
    if (seg[1] === 'me') return store.landlord as T;
  }

  // ---- dashboard ----
  if (seg[0] === 'dashboard') return store.dashboard as T;

  // ---- productivity ----
  if (seg[0] === 'productivity') {
    const summary = store.productivitySummary as Any;
    if (seg[1] === 'summary') return summary as T;
    if (seg[1] === 'goals') {
      if (method === 'PUT' && body) summary.goals = { ...body };
      return summary.goals as T;
    }
    if (seg[1] === 'day') {
      if (method === 'PUT' && body) {
        summary.todayActivity = { ...(summary.todayActivity as Any), ...body };
        return summary.todayActivity as T;
      }
      return summary.todayActivity as T;
    }
  }

  // ---- collection subresources ----
  const coll = COLLECTIONS[seg[0]];
  if (coll) {
    const list = arr(coll);

    // /payments/contract/{id}  and  /rentalunits/property/{id}
    if (coll === 'payments' && seg[1] === 'contract') {
      return list.filter((p) => (p as Any).contractId === seg[2]) as T;
    }
    if (coll === 'rentalunits' && seg[1] === 'property') {
      return list.filter((u) => (u as Any).propertyId === seg[2]) as T;
    }

    const id = seg[1];

    if (method === 'GET') {
      return (id ? list.find((x) => (x as Any).id === id) : list) as T;
    }
    if (method === 'POST') {
      const item = { id: uuid(), createdAtUtc: new Date().toISOString(), ...(body || {}) };
      list.unshift(item);
      return item as T;
    }
    if (method === 'PUT' || method === 'PATCH') {
      const idx = list.findIndex((x) => (x as Any).id === id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...(body || {}) };
        return list[idx] as T;
      }
      return (body || {}) as T;
    }
    if (method === 'DELETE') {
      store[coll] = list.filter((x) => (x as Any).id !== id);
      return {} as T;
    }
  }

  // fallback
  return {} as T;
}
