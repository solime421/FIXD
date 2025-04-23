import React from 'react';

export default function SearchBlock(props) {
  return (
    <div className="flex gap-2">
      <input
        value={props.value}
        onChange={props.onChange}
        type="text"
        placeholder={props.placeholder || "Type..."}
        className="
          w-full bg-white rounded-[5px] px-4 py-3 shadow-[0_0_4px_rgba(0,0,0,0.2)] placeholder-[#B3B3B3] text-base outline-none focus:ring-0"
          
        onKeyDown={(e) => e.key === 'Enter' && props.onSearch()}
      />
      <button
        onClick={props.onSearch}
        className="btn btn-primary w-[200px]"
        type="button"
      >
        Search
      </button>
    </div>
  );
}
