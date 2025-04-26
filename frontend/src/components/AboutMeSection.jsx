import React, { useState, useEffect } from 'react';
import InputField from './InputField';

export default function AboutMeSection({ onUpdate }) {
  const token = localStorage.getItem('authToken');
  const [details, setDetails] = useState({
    aboutMeSmall: '',
    aboutMeDetailed: '',
    countryOfOrigin: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch freelancer details on mount
  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await fetch('/api/privateFreelancerProfiles/details', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || res.statusText);
        setDetails(data);
      } catch (err) {
        console.error('Failed to load about-me:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [token]);

  // Handlers for form fields
  const [form, setForm] = useState(details);
  useEffect(() => {
    setForm(details);
  }, [details]);

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Save updated about-me
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/privateFreelancerProfiles/about-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          aboutMeSmall: form.aboutMeSmall.trim(),
          aboutMeDetailed: form.aboutMeDetailed.trim(),
          countryOfOrigin: form.countryOfOrigin.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      setDetails(data);
      onUpdate?.(data);
      setShowModal(false);
    } catch (err) {
      console.error('Save about-me failed:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Загрузка раздела "О себе"…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-lg p-6 shadow space-y-4">
      <h2 className="text-xl font-semibold">О себе</h2>
      <div>
        <h4 className="text-gray-400 text-sm">Краткое описание:</h4>
        <p className="mt-1 text-gray-700 whitespace-pre-line">{details.aboutMeSmall}</p>
      </div>
      <div>
        <h4 className="text-gray-400 text-sm">Из:</h4>
        <p className="mt-1 text-gray-700">{details.countryOfOrigin}</p>
      </div>
      <div>
        <h4 className="text-gray-400 text-sm">О себе:</h4>
        <p className="mt-1 text-gray-700 whitespace-pre-line">{details.aboutMeDetailed}</p>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary w-full"
      >
        Редактировать раздел "О себе"
      </button>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4">
            <h3 className="text-lg font-semibold">Редактировать "О себе"</h3>
            <div className="space-y-2">
              <label className="block text-gray-600">Краткое описание</label>
              <InputField
                type="text"
                name="aboutMeSmall"
                value={form.aboutMeSmall}
                onChange={onChange}
                maxLength={150}
              />
              <div className="text-xs text-gray-500">
                {form.aboutMeSmall.length}/150
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-gray-600">Страна происхождения</label>
              <InputField
                type="text"
                name="countryOfOrigin"
                value={form.countryOfOrigin}
                onChange={onChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-600">Подробная информация</label>
              <textarea
                name="aboutMeDetailed"
                value={form.aboutMeDetailed}
                onChange={onChange}
                className="w-full border rounded px-3 py-2 h-32"
                maxLength={1500}
              />
              <div className="text-xs text-gray-500">
                {form.aboutMeDetailed.length}/1500
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
                disabled={saving}
              >
                Отменить
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Сохранение…' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
