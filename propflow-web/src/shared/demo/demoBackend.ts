// In-memory mock backend for the static GitHub Pages demo.
// Serves the exported database snapshot and simulates mutations in-session
// so the UI feels live. State resets on page reload.
import demoData from './demo-data.json';

type Any = Record<string, unknown>;
const clone = <T>(v: T): T =>
  typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));

const store: Any = clone(demoData as unknown as Any);

const uuid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
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
