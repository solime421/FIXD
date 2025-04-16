import React from 'react'

const App = () => {
  return (
    <>
    <header>this is the header</header>
    <main>
        <h1>App</h1>
        <div className="w-[200px]"><button className='btn btn-secondary'>hello world</button></div>
        <br />
        <div className="w-[200px]">
            <input
              type="text"
              placeholder="Enter your full name"
              class="w-full h-[45px] bg-transparent border-none font-inter text-[14px] leading-[25px] focus:outline-none"
            />
        </div>
    </main>
    </>
  )
}

export default App