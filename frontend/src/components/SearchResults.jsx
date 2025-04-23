import React from 'react';
import { Link } from 'react-router-dom';
import FreelancerSearchCard from './FreelancerSearchCard';

export default function SearchResults({ items }) {
  if (!items.length) {
    return <p className="text-center text-gray-500">No freelancers found.</p>;
  }

  return (
    <div className="grid items-stretch grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(f => (
        <Link
          key={f.id}
          to={`/publicProfile/${f.id}`}
          className="block hover:shadow-lg transition-shadow"
        >
          <FreelancerSearchCard {...f} />
        </Link>
      ))}
    </div>
  );
}
