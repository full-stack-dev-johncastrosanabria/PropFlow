import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '../../shared/api/properties';
import type { PropertyDto, CreatePropertyDto } from '../../shared/types';

export default function PropertiesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreatePropertyDto>({
    name: '',
    address: '',
    city: '',
    country: '',
    notes: '',
  });

  const { data: properties, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Properties</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            New Property
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-input"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Property'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2">
        {properties?.map((property: PropertyDto) => (
          <div key={property.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {property.name}
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  {property.city}, {property.country}
                </p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(property.id)}
                className="btn btn-danger btn-sm"
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
            <p style={{ color: 'var(--gray-700)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {property.address}
            </p>
            {property.notes && (
              <p style={{ color: 'var(--gray-600)', fontSize: '0.8125rem', fontStyle: 'italic' }}>
                {property.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {properties?.length === 0 && !showForm && (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
            No properties yet. Add your first property to get started!
          </p>
        </div>
      )}
    </div>
  );
}
