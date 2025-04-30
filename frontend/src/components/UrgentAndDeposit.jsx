import React, { useState, useEffect } from 'react';
import {
  fetchFreelancerSettings,
  updateDepositAmount,
  updateUrgentServiceToggle
} from '../api/urgent';

export default function FreelancerPersonalPage({ onUpdate }) {
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

  // On mount, fetch settings
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { depositAmount, urgentServiceEnabled } = await fetchFreelancerSettings();
        if (cancelled) return;
        setDeposit(depositAmount);
        setNewDeposit(depositAmount);
        setUrgentEnabled(urgentServiceEnabled);
        setNewUrgent(urgentServiceEnabled);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Save deposit to backend
  const handleDepositSave = async e => {
    e.preventDefault();
    setSavingDeposit(true);
    try {
      const updated = await updateDepositAmount(parseFloat(newDeposit));
      setDeposit(updated);
      setShowDepositModal(false);
      onUpdate?.({ depositAmount: updated });
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingDeposit(false);
    }
  };

  // Save urgent toggle to backend
  const handleUrgentSave = async () => {
    setSavingUrgent(true);
    try {
      const updated = await updateUrgentServiceToggle(newUrgent);
      setUrgentEnabled(updated);
      setShowUrgentModal(false);
      onUpdate?.({ urgentServiceEnabled: updated });
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingUrgent(false);
    }
  };

  if (loading) return <p>Loading freelancer settings…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

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
