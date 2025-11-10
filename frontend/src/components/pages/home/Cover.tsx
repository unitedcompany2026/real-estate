import React from 'react'

export default function Cover() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src="./Cover2.png"
        alt="Cover"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}
