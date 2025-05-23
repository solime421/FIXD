import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DefaultAvatar from '../../public/icons/noUser.svg';
import LocationSection from '../components/LocationSection.jsx';
import ReviewsSection from '../components/ReviewsSection.jsx';
import ProfileSidebar from '../components/ProfileSidebar.jsx';
import { fetchPublicProfile, startChat } from '../api/publicProfile';



export default function PublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // get profile info
  useEffect(() => {
    const ctrl = new AbortController();

    async function loadProfile() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchPublicProfile(id);
        setProfile(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    return () => ctrl.abort();
  }, [id]);

  // kick off (or get) a chat and go there
  const handleStartChat = async () => {
    try {
      const chat = await startChat(id);
      navigate(`/chats/${chat.id}`);
    } catch (err) {
      console.error('Starting chat failed:', err);
      alert(err.message);
    }
  };

  if (loading)  return <p className="p-8">Loading profile…</p>;
  if (error)    return <p className="p-8 text-red-500">{error}</p>;
  if (!profile) return null;

  const {
    firstName,
    lastName,
    profilePicture,
    rating,
    aboutMeSmall,
    aboutMeDetailed,
    countryOfOrigin,
    memberSince,
    portfolio = [],
  } = profile;

  const prevImage = () =>
    setCurrentIndex(i => (i > 0 ? i - 1 : portfolio.length - 1));
  const nextImage = () =>
    setCurrentIndex(i => (i < portfolio.length - 1 ? i + 1 : 0));

  return (
    <main className="py-[150px]">
      <div className="mx-[120px] grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left column */}
        <div className="space-y-[60px]">
          {/* Avatar + name + rating */}
          <div className="flex items-center space-x-4">
            <img
              src={profilePicture || DefaultAvatar}
              alt={`${firstName} ${lastName}`}
              className="h-18 w-18 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold text-[#3A001E]">
                {firstName} {lastName}
              </h2>
              <div className="flex items-center text-yellow-500 mt-1">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.56-.954L10 .5l2.95 5.456 6.56.954-4.755 4.635 1.123 6.545z" />
                </svg>
                <span className="ml-1 font-medium text-gray-700">
                  {(rating ?? 0).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Short bio */}
          <h3 className="font-semibold py-2">
            {aboutMeSmall || 'Описание не предоставлено.'}
          </h3>

          {/* Portfolio slider */}
          <div>
            {portfolio.length > 0 ? (
              <>
                <img
                  src={portfolio[currentIndex].imageUrl}
                  alt={`Portfolio ${currentIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="mt-4 flex justify-center items-center gap-8">
                  <button
                    onClick={prevImage}
                    className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <span className="text-gray-700">
                    {currentIndex + 1} / {portfolio.length}
                  </span>
                  <button
                    onClick={nextImage}
                    className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-500 italic">Нет изображений в портфолио.</div>
            )}
          </div>

          {/* Detailed about */}
          <div className="rounded-lg bg-white p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
            <h2 className="font-semibold text-[#3A001E] mb-5">
              О {firstName}
            </h2>
            <div className="space-y-3">
              <div>
                <span className="block text-gray-400">Из:</span>
                <span>{countryOfOrigin || '—'}</span>
              </div>
              <div>
                <span className="block text-gray-400">На платформе с:</span>
                <span>
                {memberSince
                  ? new Date(memberSince).toLocaleString('ru', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
                </span>
              </div>
            </div>
            <hr className="my-4 border-gray-200" />
            <p>
              {aboutMeDetailed || "No detailed bio provided."}
            </p>
          </div>

          {/* Location */}
          <div>
            <h2 className="font-semibold mb-5">Местоположение</h2>
            <LocationSection
              address={profile.locationAddress}
              lat={profile.locationLat}
              lng={profile.locationLng}
            />
          </div>

          {/* Reviews */}
          <h2 className="font-semibold mb-5">Отзывы</h2>
          <ReviewsSection reviews={profile.reviews} />
        </div>

        {/* Right column (sidebar) */}
        <ProfileSidebar
          freelancerId={profile.id}
          specialties={profile.specialties.map(s => s.specialty)}
          depositAmount={profile.depositAmount}
          canMessage={profile.canMessage}
          urgentServiceEnabled={profile.urgentServiceEnabled}
          phone={profile.phone}
          onStartChat={handleStartChat}
        />
      </div>
    </main>
  );
}
