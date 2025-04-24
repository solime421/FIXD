import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LocationSection from '../components/LocationSection.jsx';
import LocationInput from '../components/LocationInput.jsx';
import UrgentAndDeposit from '../components/UrgentAndDeposit.jsx';
import PortfolioSection from '../components/PortfolioSection.jsx';
//import SpecialtiesSection from '../components/SpecialtiesSection.jsx';

import DefaultAvatar from '../../public/icons/noUser.svg';
import Whatsapp from '../../public/icons/Whatsapp.svg'
import Telegram from '../../public/icons/Telegram.svg'
import Instagram from '../../public/icons/Instagram.svg'
import Email from '../../public/icons/Email.svg'

export default function PersonalProfilePage() {
  const { updateUserPic } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit modals visibility
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Form states
  const [personalForm, setPersonalForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [locationForm, setLocationForm] = useState({ address: '', lat: null, lng: null });

  // File input for avatar
  const fileInputRef = useRef(null);

  // Load user on mount
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('authToken');
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch('/api/privateProfiles/me', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || res.statusText);
        setProfile(data);
        // init forms
        setPersonalForm({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });
        setLocationForm({
          address: data.locationAddress,
          lat: data.locationLat,
          lng: data.locationLng,
        });
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    return () => controller.abort();
  }, []);

  // Avatar edit
  const handlePhotoClick = () => fileInputRef.current?.click();
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const formData = new FormData(); 
    formData.append('image', file);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/privateProfiles/profile-picture', {
        method: 'POST', headers: { ...(token && { Authorization: `Bearer ${token}` }) }, body: formData,
      });
      const text = await res.text(); let data;
      try { data = JSON.parse(text); } catch { throw new Error(text || res.statusText); }
      if (!res.ok) throw new Error(data.message || res.statusText);
      setProfile(prev => ({ ...prev, profilePicture: data.profilePicture }));
      updateUserPic(data.profilePicture);
    } catch (err) { console.error(err); setError(err.message); }
  };

  // Save personal data
  const handlePersonalSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/privateProfiles/personal-data', {
        method: 'POST', headers: {
          'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }),
        }, body: JSON.stringify(personalForm),
      });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || res.statusText);
      setProfile(prev => ({ ...prev, ...data }));
      setShowPersonalModal(false);
    } catch (err) { console.error(err); setError(err.message); }
    finally { setSaving(false); }
  };

  // Save location data
  const handleLocationSave = async () => {
    setSaving(true); setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/privateProfiles/location', {
        method: 'POST', headers: {
          'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }),
        }, body: JSON.stringify(locationForm),
      });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || res.statusText);
      setProfile(prev => ({ ...prev,
        locationAddress: data.locationAddress,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
      }));
      setShowLocationModal(false);
    } catch (err) { console.error(err); setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="p-8">Loading…</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!profile) return null;

  return (
    <main className="py-[150px] bg-[var(--color-bg-alt)]">
      {/* Header */}
        <div className="mx-[204px] flex items-center space-x-6 py-[20px] mb-[50px]">
          <div className="relative">
            <img
              src={profile.profilePicture || DefaultAvatar}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="h-24 w-24 rounded-full object-cover"
            />
            <button
              onClick={handlePhotoClick}
              className="absolute bottom-0 right-0 bg-[#F74C25] text-white text-xs px-2 py-1 rounded-full hover:bg-[#e04320]"
            >
              Edit Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <h2 className="font-semibold text-[#3A001E]">
            {profile.firstName} {profile.lastName}
          </h2>
        </div>

      {/* Layout: menu + content */}
      <div className="mx-[120px] grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="w-2/3 bg-white mx-auto sticky top-[150px] rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.2)] p-4 space-y-2 h-fit">
          <Link to="#" className="block text-gray-700 hover:underline">Personal Data</Link>
          <Link to="#" className="block text-gray-700 hover:underline">Location</Link>
          <Link to="#" className="block text-gray-700 hover:underline">My Orders</Link>
          <Link to="#" className="block text-gray-700 hover:underline">Logout</Link>
        </aside>
 
        <div className="w-1/2 mx-auto lg:col-span-2 space-y-8">
          {/* Personal Data Card */}
          <div className="bg-white rounded-lg p-6 space-y-4 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-semibold mb-4">Personal Data</h2>
            <p><span className="text-gray-400">Name:</span> {profile.firstName}</p>
            <p><span className="text-gray-400">Last Name:</span> {profile.lastName}</p>
            <p><span className="text-gray-400">Phone Number:</span> {profile.phone}</p>
            <p><span className="text-gray-400">Email:</span> {profile.email}</p>
            <button onClick={() => setShowPersonalModal(true)}
                    className="btn btn-primary w-full">Edit personal data</button>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-lg p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] ">
            <h2 className="font-semibold mb-4">Location</h2>
            <LocationSection
              address={profile.locationAddress}
              lat={profile.locationLat}
              lng={profile.locationLng}
            />
            <button onClick={() => setShowLocationModal(true)}
                    className="btn btn-primary w-full">Edit location</button>
          </div>

          {profile.role === 'freelancer' && (
            <UrgentAndDeposit
              initialDeposit={profile.depositAmount}
              initialUrgent={profile.urgentServiceEnabled}
              onUpdate={updates => {
                // reflect any changes back to this main profile state
                setProfile(p => ({ ...p, ...updates }));
              }}
            />
          )}

          {/* FREELANCER PORTFOLIO*/}
          {profile.role === 'freelancer' && (
            <PortfolioSection
              images={profile.portfolio || []}
              onEdit={updated => setProfile(p => ({ ...p, portfolio: updated }))}
              onAdd ={added   => setProfile(p => ({ ...p, portfolio: added   }))}
            />
          )}

          {/* Contact Us Card */}
          <div className="bg-white rounded-lg p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
            <h2 className="font-semibold mb-4">Contact Us</h2>
            {/* Icons row */}
            <div className="flex justify-around space-y-6 mt-7">
              <a href={`#`} title="Email">
                <img src={Email} alt="Email" className="h-8 w-8" />
              </a>
              <a href={'#'} title="Instagram" target="_blank" rel="noopener noreferrer">
                <img src={Instagram} alt="Instagram" className="h-8 w-8" />
              </a>
              <a href={`#`} title="WhatsApp" target="_blank" rel="noopener noreferrer">
                <img src={Whatsapp} alt="Whatsapp" className="h-8 w-8" />
              </a>
              <a href={'#'} title="Telegram" target="_blank" rel="noopener noreferrer">
                <img src={Telegram} alt="Telegram" className="h-8 w-8" />
              </a>
            </div>
            {/* Action buttons */}
            <a
            href="https://wa.me/79637268181"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full text-center block"
          >
            Help & Support?
          </a>
          </div>

          {/* Personal Data Modal */}
          {showPersonalModal && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Edit Personal Data</h3>
                <form onSubmit={handlePersonalSave} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                    <input type="text" value={personalForm.firstName}
                           onChange={e => setPersonalForm(f => ({ ...f, firstName: e.target.value }))}
                           className="w-full border-b border-gray-300 pb-1 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Last Name</label>
                    <input type="text" value={personalForm.lastName}
                           onChange={e => setPersonalForm(f => ({ ...f, lastName: e.target.value }))}
                           className="w-full border-b border-gray-300 pb-1 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Phone Number</label>
                    <input type="tel" value={personalForm.phone}
                           onChange={e => setPersonalForm(f => ({ ...f, phone: e.target.value }))}
                           className="w-full border-b border-gray-300 pb-1 focus:outline-none" required />
                  </div>
                  <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={() => setShowPersonalModal(false)}
                            className="btn btn-secondary">Cancel</button>
                    <button type="submit" disabled={saving}
                            className="btn btn-primary">{saving ? 'Saving…' : 'Done'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Location Modal */}
          {showLocationModal && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Edit Location</h3>
                <LocationInput
                  value={locationForm.address}
                  onPlaceChange={place => setLocationForm(place)}
                />
                <div className="flex justify-end space-x-4 mt-4">
                  <button type="button" onClick={() => setShowLocationModal(false)}
                          className="btn btn-secondary">Cancel</button>
                  <button type="button" onClick={handleLocationSave} disabled={saving}
                          className="btn btn-primary">{saving ? 'Saving…' : 'Done'}</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
