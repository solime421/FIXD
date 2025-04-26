import React, { useState, useEffect, useRef } from 'react';

export default function PortfolioSection({ onEdit, onAdd }) {
  const token = localStorage.getItem('authToken');

  // State for images, loading, and error
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingId, setDeletingId]       = useState(null);

  // File input ref and uploading state
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Fetch images on mount
  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const res = await fetch('/api/privateFreelancerProfiles/portfolio', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || res.statusText);
        setImages(data);
      } catch (err) {
        console.error('Failed to load portfolio images:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [token]);

  // Allow adding only if fewer than 9 images
  const canAddMore = images.length < 9;

  // Handler: add images, enforce 9-image max
  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !canAddMore) return;
    // enforce max limit
    const allowed = files.slice(0, 9 - images.length);
    setUploading(true);
    const added = [];
    try {
      for (const file of allowed) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/privateFreelancerProfiles/portfolio', {
          method: 'POST',
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || res.statusText);
        added.push(data);
      }
      const updated = [...images, ...added];
      setImages(updated);
      onAdd?.(updated);
    } catch (err) {
      console.error('Add portfolio image failed:', err);
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  // Handler: delete image
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/privateFreelancerProfiles/portfolio/${id}`, {
        method: 'DELETE',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      const updated = images.filter(img => img.id !== id);
      setImages(updated);
      onEdit?.(updated);
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for uploads */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFilesSelected}
      />

      {/* Loading / error states */}
      {loading && <p>Загрузка изображений…</p>}
      {error   && <p className="text-red-500">{error}</p>}

      {/* Portfolio display */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="font-semibold mb-6">Фотографии ({images.length}/9)</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {images.map(img => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt="Portfolio"
              className="h-40 w-40 object-cover rounded"
            />
          ))}
          {images.length === 0 && (
            <p className="col-span-3 text-gray-500">Пока нет фотографий.</p>
          )}
        </div>
        <div className="2xl:flex space-x-4 space-y-4 2xl:space-y-0">
          <button
            className="btn btn-secondary 2xl:flex-1 w-full"
            onClick={() => setShowEditModal(true)}
          >
            Редактировать фотографии
          </button>
          <button
            className={`btn btn-primary 2xl:flex-1 w-full ${(!canAddMore || uploading) && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => canAddMore && !uploading && fileInputRef.current.click()}
            disabled={!canAddMore || uploading}
          >
            {uploading ? 'Загрузка…' : canAddMore ? 'Добавить фотографии' : 'Достигнут лимит'}
          </button>
        </div>
      </div>

      {/* Remove Pictures Modal */}
      {showEditModal && (
        <div className="fixed inset-0  bg-black/20 backdrop-blur-sm  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Удалить фотографии</h3>
            <div className="grid grid-cols-3 gap-2">
              {images.map(img => (
                <div key={img.id} className="relative">
                  <img
                    src={img.imageUrl}
                    alt="Portfolio"
                    className="h-40 w-40 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deletingId === img.id}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                Готово
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
