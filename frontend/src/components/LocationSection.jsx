import React from 'react';

export default function LocationSection({ address, lat, lng }) {
  if (!address || lat == null || lng == null) return null;

  // set a small bbox around the point for the embed
  const delta = 0.01;
  const left   = lng - delta;
  const right  = lng + delta;
  const top    = lat + delta;
  const bottom = lat - delta;

  const src = `https://www.openstreetmap.org/export/embed.html?
    bbox=${encodeURIComponent(`${left},${bottom},${right},${top}`)}
    &layer=mapnik
    &marker=${lat},${lng}`
    .replace(/\s+/g, '');

  return (
    <section className="mb-8">
      <p className="text-gray-700 mb-4">{address}</p>
      <div className="w-full h-64 overflow-hidden rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.2)]">
        <iframe
          className="w-full h-full border-0"
          src={src}
          loading="lazy"
          title="Freelancer location"
        />
      </div>
    </section>
  );
}
