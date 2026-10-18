import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Building2, MapPin } from 'lucide-react';
import { propertiesApi } from '../../shared/api/properties';
import type { PropertyDto, CreatePropertyDto } from '../../shared/types';
import { propertyImageFor } from '@/shared/media';
import { PageHeader } from '@/components/world/PageHeader';
import { Panel } from '@/components/world/Panel';
import { Button } from '@/components/world/Button';
import { Field, TextInput, Textarea } from '@/components/world/fields';
import { EmptyState, PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { BlurFade } from '@/components/magicui/blur-fade';

export default function PropertiesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreatePropertyDto>({
    name: '',
    address: '',
    city: '',
    country: '',
    notes: '',
  });

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: propertiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setShowForm(false);
      setFormData({ name: '', address: '', city: '', country: '', notes: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: propertiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <PageLoading label={t('props.opening')} />;

  if (error) {
    return <ErrorNote message={error instanceof Error ? error.message : t('props.fail')} />;
  }

  return (
    <div className="space-y-5">
      <BlurFade>
        <PageHeader
          title={t('props.title')}
          copy={t('props.copy')}
          action={
            <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'}>
              <Plus className="size-4" aria-hidden />
              {showForm ? t('common.cancel') : t('props.add')}
            </Button>
          }
        />
      </BlurFade>

      {showForm && (
        <BlurFade>
          <Panel title={t('props.new')} bodyClassName="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t('props.name')} required>
                  <TextInput
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('props.namePlaceholder')}
                    required
                  />
                </Field>
                <Field label={t('props.city')} required>
                  <TextInput
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={t('props.city')}
                    required
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t('props.address')} required>
                  <TextInput
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={t('props.addressPlaceholder')}
                    required
                  />
                </Field>
                <Field label={t('props.country')} required>
                  <TextInput
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder={t('props.country')}
                    required
                  />
                </Field>
              </div>
              <Field label={t('leads.notes')}>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('props.notesPlaceholder')}
                />
              </Field>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="submit" loading={createMutation.isPending}>
                  {t('props.create')}
                </Button>
              </div>
            </form>
          </Panel>
        </BlurFade>
      )}

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {properties.map((property: PropertyDto, i) => (
            <BlurFade key={property.id} delay={Math.min(i * 0.04, 0.2)}>
              <article className="group flex h-full flex-col overflow-hidden rounded-sheet border border-rule bg-paper-raised shadow-sheet transition-colors hover:border-rule-strong">
                <div className="relative border-b border-rule">
                  <img
                    src={property.imageUrl ?? propertyImageFor(property.id)}
                    alt={`${property.name} — ${property.city}`}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                  <span className="absolute bottom-3 left-4 flex size-9 items-center justify-center rounded-[10px] border border-rule-strong bg-paper-raised/95 text-hue-properties shadow-tab">
                    <Building2 className="size-[18px]" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-[17px] font-semibold leading-snug text-carbon">
                        {property.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[13px] text-carbon-soft">
                        <MapPin className="size-3.5 shrink-0" aria-hidden />
                        {property.city}, {property.country}
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(t('props.deleteConfirm', { name: property.name }))) {
                          deleteMutation.mutate(property.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                  <p className="mt-3.5 text-[14px] text-carbon-soft">{property.address}</p>
                  {property.notes && (
                    <p className="mt-2 border-t border-rule pt-2.5 text-[13.5px] italic text-carbon-faint">
                      {property.notes}
                    </p>
                  )}
                </div>
              </article>
            </BlurFade>
          ))}
        </div>
      ) : (
        !showForm && (
          <BlurFade>
            <EmptyState
              icon={Building2}
              title={t('props.emptyTitle')}
              copy={t('props.emptyCopy')}
              action={
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="size-4" aria-hidden /> {t('props.add')}
                </Button>
              }
            />
          </BlurFade>
        )
      )}
    </div>
  );
}
