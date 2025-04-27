import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * FreelancerPersonalPage
 * Fetches and manages freelancer-specific settings:
 *  - Average Order Amount (depositAmount)
 *  - Urgent Services toggle
 */
export default function FreelancerPersonalPage() {
  const token = localStorage.getItem('authToken');

  // State for deposit and urgent settings
  const [deposit, setDeposit] = useState(0);
  const [urgentEnabled, setUrgentEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [newDeposit, setNewDeposit] = useState('');
  const [savingDeposit, setSavingDeposit] = useState(false);

  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [newUrgent, setNewUrgent] = useState(false);
  const [savingUrgent, setSavingUrgent] = useState(false);

  // On mount, fetch freelancer details
  useEffect(() => {
    async function loadDetails() {
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
        // initialize state from backend
        setDeposit(data.depositAmount);
        setNewDeposit(data.depositAmount);
        setUrgentEnabled(data.urgentServiceEnabled);
        setNewUrgent(data.urgentServiceEnabled);
      } catch (err) {
        console.error('Failed to load freelancer details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [token]);

  // Save deposit to backend
  const handleDepositSave = async (e) => {
    e.preventDefault();
    setSavingDeposit(true);
    try {
      const res = await fetch('/api/privateFreelancerProfiles/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ depositAmount: parseFloat(newDeposit) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      setDeposit(data.depositAmount);
      setShowDepositModal(false);
    } catch (err) {
      console.error('Deposit update failed:', err);
      setError(err.message);
    } finally {
      setSavingDeposit(false);
    }
  };

  // Save urgent toggle to backend
  const handleUrgentSave = async () => {
    setSavingUrgent(true);
    try {
      const res = await fetch('/api/privateFreelancerProfiles/urgent-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ urgentServiceEnabled: newUrgent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      setUrgentEnabled(data.urgentServiceEnabled);
      setShowUrgentModal(false);
    } catch (err) {
      console.error('Urgent toggle failed:', err);
      setError(err.message);
    } finally {
      setSavingUrgent(false);
    }
  };

  if (loading) return <p>Loading freelancer settings…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Average Order Amount Card */}
      <div className="bg-white rounded-lg space-y-4 p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] ">
        <h2 className="text-xl font-semibold mb-4">Средняя сумма заказа:</h2>
        <p className="mb-4">₽{deposit.toFixed(2)}</p>
        <button
          className="btn btn-primary w-full"
          onClick={() => setShowDepositModal(true)}
        >
          Изменить среднюю сумму заказа
        </button>
      </div>

      {/* Urgent Services Card */}
      <div className="bg-white rounded-lg space-y-4 p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
        <h2 className="text-xl font-semibold mb-4">Срочные услуги</h2>
        <p className="text-gray-500 mb-4">
          Другие клиенты смогут звонить вам в любое время через ваш профиль.
        </p>
        <p className="mb-4">
          <strong>{urgentEnabled ? 'Включено' : 'Отключено'}</strong>
        </p>
        <button
          className="btn btn-primary w-full"
          onClick={() => setShowUrgentModal(true)}
        >
          Редактировать
        </button>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Установить среднюю сумму заказа</h3>
            <form onSubmit={handleDepositSave} className="space-y-4">
              <input
                type="number"
                min="0"
                step="0.01"
                value={newDeposit}
                onChange={e => setNewDeposit(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="btn btn-secondary"
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  disabled={savingDeposit}
                  className="btn btn-primary"
                >
                  {savingDeposit ? 'Сохранение…' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Urgent Service Modal */}
      {showUrgentModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Переключить срочные услуги</h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                id="urgent-toggle"
                type="checkbox"
                checked={newUrgent}
                onChange={e => setNewUrgent(e.target.checked)}
                className="h-5 w-5"
              />
              <label htmlFor="urgent-toggle" className="text-gray-700">Включить срочные услуги</label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUrgentModal(false)}
                className="btn btn-secondary"
              >
                Отменить
              </button>
              <button
                onClick={handleUrgentSave}
                disabled={savingUrgent}
                className="btn btn-primary"
              >
                {savingUrgent ? 'Сохранение…' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
