import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PointFinger from '../../public/images/PointFinger.png';

/**
 * Sidebar component showing specialties, rate, and contact actions.
 * Sticks to viewport when scrolling.
 */
export default function ProfileSidebar({
  freelancerId,
  specialties = [],
  depositAmount = 0,
  canMessage = false,
  urgentServiceEnabled = false,
  phone,
  onStartChat,           // new prop to kick off the chat
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If no specialties & no actions, render nothing
  if (!canMessage && !urgentServiceEnabled && specialties.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-[150px] space-y-6">
      <div className="gradient w-1/2 mx-auto rounded-lg p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-2 gap-4 items-start mb-6">

          {/* Left column: icon */}
          <div className="flex py-4 justify-start">
            <img
              src={PointFinger}
              alt="Pointing hand icon"
              className="h-30 w-30"
            />
          </div>

          {/* Right column: text info */}
          <div className="space-y-4">
            <div className="justify-self-end text-right">
              <h3 className="text-gray-400 text-sm capitalize mb-1 font-semibold">
                Specialises:
              </h3>
              <ul className="list-none space-y-1">
                {specialties.length > 0 
                  ? specialties.map((spec, idx) => (
                      <li key={idx} className="capitalize">
                        {spec}
                      </li>
                    ))
                  : <li>—</li>
                }
              </ul>
            </div>
          </div>
        </div>
        <div className='pb-3'>
          <h3 className="capitalize mb-1 flex justify-between font-semibold">
            <span className='text-gray-400'>Average Order Amount:</span> ${depositAmount}
          </h3>
        </div>

        {/* Send Message (only for clients) */}
        {canMessage && (
          <button
            onClick={onStartChat}
            className="btn btn-primary w-full"
          >
            Send a message
          </button>
        )}
      </div>

      {/* Emergency card: same width as main card */}
      {urgentServiceEnabled && canMessage && (
        <div className="w-1/2 mx-auto rounded-lg gradient p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
          <h3 className="text-gray-400 font-semibold mb-2">Emergency Available!</h3>
          <a
            href={`tel:${phone}`}
            className="btn btn-secondary w-full text-center"
          >
            Call
          </a>
        </div>
      )}
    </aside>
  );
}