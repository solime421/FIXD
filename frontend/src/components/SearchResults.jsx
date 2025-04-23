import React from 'react';
import FreelancerSearchCard from './FreelancerSearchCard.jsx';

export default function SearchResults({ items }) {
  if (!items.length) {
    return <p className="text-center text-gray-500 pt-[20px]">No freelancers found.</p>;
  }

  return (
    <div className="grid gap-6 pt-[5px] grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(f => (
        <FreelancerSearchCard
          key={f.id}
          firstName={f.firstName}
          lastName={f.lastName}
          lastPortfolioImage={f.lastPortfolioImage}
          urgentServiceEnabled={f.urgentServiceEnabled}
          profilePicture={f.profilePicture}
          aboutMeSmall={f.aboutMeSmall}
          rating={f.rating}
          depositAmount={f.depositAmount}
        />
      ))}
    </div>
  );
}
