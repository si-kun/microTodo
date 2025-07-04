import React, { ReactNode } from 'react'

const PrivateLayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='bg-gray-100 w-screen h-hull min-h-screen p-4'>{children}</div>
  )
}

export default PrivateLayout