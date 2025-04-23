// src/components/LocationInput.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function LocationInput({ value = '', onPlaceChange }) {
  const [input, setInput] = useState(value);
  const [results, setResults] = useState([]);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!input) {
      setResults([]);
      return;
    }
    // debounce 300ms
    const timeout = setTimeout(() => {
      // cancel previous request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          input
        )}`,
        { signal: controller.signal }
      )
        .then(res => res.json())
        .then(data => setResults(data))
        .catch(err => {
          if (err.name !== 'AbortError') console.error(err);
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [input]);

  return (
    <div className="relative">
      <input
        className="w-full border rounded px-3 py-2"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Start typing address…"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-48 overflow-auto">
          {results.map(place => (
            <li
              key={place.place_id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setInput(place.display_name);
                setResults([]);
                onPlaceChange({
                  address: place.display_name,
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lon),
                });
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
