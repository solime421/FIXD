import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function LocationInput({ value = '', onPlaceChange }) {
  const [input, setInput] = useState(value);
  const [results, setResults] = useState([]);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!input) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      // Cancel previous request if any
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      axios.get('https://nominatim.openstreetmap.org/search', {
        params: { format: 'json', limit: 5, q: input },
        signal: controller.signal
      })
      .then(response => {
        setResults(response.data);
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          // request was cancelled
        } else {
          console.error(err);
        }
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
        placeholder="Начните вводить адрес…"
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
