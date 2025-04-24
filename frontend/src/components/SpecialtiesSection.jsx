import React, { useState, useEffect } from 'react';

export default function SpecialtiesSection({ onEdit, onAdd }) {
  const token = localStorage.getItem('authToken');

  // State for specialties list, loading & error
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // Modal state for edit (delete) and add flows
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [newSpec, setNewSpec]             = useState('');
  const [saving, setSaving]               = useState(false);
  const [deletingId, setDeletingId]       = useState(null);

  // Fetch specialties on component mount
  useEffect(() => {
    async function fetchSpecialties() {
      setLoading(true);
      try {
        const res = await fetch('/api/privateFreelancerProfiles/specialities', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || res.statusText);
        setSpecialties(data);
      } catch (err) {
        console.error('Failed to load specialties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSpecialties();
  }, [token]);

  // Helper: can add more if fewer than 5
  const canAddMore = specialties.length < 5;

  // Add a new specialty via POST
  const handleAdd = async () => {
    if (!newSpec.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/privateFreelancerProfiles/specialities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ specialty: newSpec.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      const updated = [...specialties, data];
      setSpecialties(updated);
      onAdd?.(updated);
      setNewSpec('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Add specialty failed:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete a specialty via DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this specialty?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/privateFreelancerProfiles/specialities/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      const updated = specialties.filter(s => s.id !== id);
      setSpecialties(updated);
      onEdit?.(updated);
    } catch (err) {
      console.error('Delete specialty failed:', err);
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Display card */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">
          Specialties ({specialties.length}/5)
        </h2>
        {loading && <p>Loading…</p>}
        {error   && <p className="text-red-500">{error}</p>}

        <div className="space-y-2 mb-4">
          {specialties.length > 0 ? (
            specialties.map(s => (
              <div key={s.id} className="flex items-center">
                <span className="flex-1 capitalize text-gray-500">{s.specialty}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No specialties yet.</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            className="btn btn-secondary flex-1"
            onClick={() => setShowEditModal(true)}
          >
            Edit Specialties
          </button>
          <button
            className={`btn btn-primary flex-1 ${(!canAddMore || saving) && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => canAddMore && setShowAddModal(true)}
            disabled={!canAddMore || saving}
          >
            {canAddMore ? 'Add Specialties' : 'Limit reached'}
          </button>
        </div>
      </div>

      {/* Edit Modal: remove specialties */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Remove Specialties</h3>
            <div className="space-y-2">
              {specialties.map(s => (
                <div key={s.id} className="flex justify-between items-center">
                  <span>{s.specialty}</span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-secondary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal: new specialty */}
      {showAddModal && (
        <div className="fixed inset-0  bg-black/20 backdrop-blur-sm  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Add Specialty</h3>
            <input
              type="text"
              value={newSpec}
              onChange={e => setNewSpec(e.target.value)}
              placeholder="Enter specialty"
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleAdd}
                disabled={!newSpec.trim() || saving}
                className="btn btn-primary flex-1"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
