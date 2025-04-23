import React from 'react';

/**
 * Masonry-style Reviews Section using CSS multi-column
 */
export default function ReviewsSection({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600 italic">No reviews yet.</p>;
  }

  return (
    <section className="mb-8">
      <h2 className="font-semibold text-[#3A001E] mb-4">Reviews</h2>

      <div
        className="columns-2 space-y-6"
        style={{ columnGap: '1.5rem' }}
      >
        {reviews.map((r, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-lg p-4 shadow-[0_0_4px_rgba(0,0,0,0.2)] bg-white w-full"
          >
            <div className="flex items-center mb-2">
              <strong className="font-medium">
                {r.reviewer.firstName} {r.reviewer.lastName}
              </strong>
              <div className="ml-auto flex items-center text-yellow-500">
                {Array.from({ length: Math.round(r.rating) }).map((_, idx) => (
                  <svg
                    key={idx}
                    className="h-4 w-4 fill-current mr-1"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.56-.954L10 .5l2.95 5.456 6.56.954-4.755 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-2">{r.comment}</p>
            <p className="text-xs text-gray-500">
              {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
