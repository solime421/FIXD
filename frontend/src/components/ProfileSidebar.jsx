import React from 'react';
import PointFinger from '../../public/images/PointFinger.png';

/**
 * ProfileSidebar
 * Displays specialties, average order amount, and contact buttons.
 * Cards are centered at 2/3 width, and the main info section
 * is laid out in two columns: text and icon.
 */
export default function ProfileSidebar({
  specialties = [],             // array of specialty strings
  depositAmount = 0,            // numeric average order amount
  canMessage = false,           // whether to show "Send a message"
  urgentServiceEnabled = false, // whether to show "Emergency Available"
  phone,                        // phone number for the call link
}) {
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

        {/* Send a message button (full width, below grid) */}
        {canMessage && (
          <button className="btn btn-primary w-full">
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