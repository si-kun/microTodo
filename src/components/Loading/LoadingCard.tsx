import { Loader2Icon } from 'lucide-react'
import React from 'react'

const LoadingCard = () => {
  return (
    <div className='absolute top-0 left-0 rounded-lg bg-gray-300/40 w-full h-full flex items-center justify-center'>
        <Loader2Icon className='animate-spin' />
        読み込み中...
    </div>
  )
}

export default LoadingCard