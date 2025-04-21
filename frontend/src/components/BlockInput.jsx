import React from 'react';

export default function BlockInput(props) {
  return (
    <input
      {...props}
      type="text"
      placeholder={props.placeholder || "Type..."}
      className="
        w-full bg-white rounded-[5px] px-4 py-3 shadow-[0_0_4px_rgba(0,0,0,0.2)] placeholder-[#B3B3B3] text-base outline-none focus:ring-0
      "
    />
  );
}