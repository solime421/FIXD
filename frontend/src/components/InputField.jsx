import React from 'react'
import clsx from 'clsx'

const InputField = React.forwardRef(
  ({ className, ...props }, ref) => (
    <input
    ref={ref}
    className={clsx(
      'block w-full bg-transparent',
      'font-body text-base leading-[14px]',
      'py-[7px] px-0',
      'border-b-1 border-black ',
      'outline-none focus:outline-none focus:ring-0',
      'placeholder-[#8B8787]',
      className
    )}
    {...props}
  />
  )
)

export default InputField
