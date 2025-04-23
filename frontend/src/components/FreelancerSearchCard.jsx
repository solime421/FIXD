import React from 'react';
import DefaultAvatar from '../../public/icons/noUser.svg';
import UrgentServiceEnabledIcon from '../../public/icons/UrgentService-enabled.svg';
import NoImage from '../../public/images/NoImage.png';

export default function FreelancerSearchCard({
  firstName,
  lastName,
  lastPortfolioImage,
  profilePicture,
  aboutMeSmall,
  urgentServiceEnabled,
  rating,
  depositAmount,
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
      {/* IMAGE + URGENT BADGE */}
      <div className="relative p-4">
        <img
          src={lastPortfolioImage || NoImage}
          alt={`${firstName} ${lastName}`}
          className="w-full h-40 object-cover rounded-[5px]"
        />
        {urgentServiceEnabled && (
          <img
            src={UrgentServiceEnabledIcon}
            alt="Urgent service available"
            className="absolute top-3 right-4 h-7 w-7"
            title="Urgent service available"
          />
        )}
      </div>

      {/* CONTENT (header + bio) */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <img
            src={profilePicture || DefaultAvatar}
            alt={`${firstName} avatar`}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="ml-2 font-medium text-[#3A001E]">
            {firstName} {lastName}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {aboutMeSmall}
        </p>

        {/* FOOTER: mt-auto pushes this whole row to the bottom */}
        <div className="mt-auto flex justify-between items-baseline text-sm">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 fill-current text-yellow-500 mr-1"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.56-.954L10 .5l2.95 5.456 6.56.954-4.755 4.635 1.123 6.545z" />
            </svg>
            <span>{rating.toFixed(1)}</span>
          </div>
          <span className="whitespace-nowrap text-sm text-[#ACACAC]">
            Average Order Amount: ${depositAmount}
          </span>
        </div>
      </div>
    </div>
  );
}
