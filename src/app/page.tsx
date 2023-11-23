'use client'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

export default function Home() {
  return (
    <>
    <Navbar />
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className='text-black dark:text-white'>INF</h1>
    </main>
    </>
  )
}
