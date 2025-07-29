"use client"
import React from 'react'
import { useRouter } from 'next/navigation';    
import { signOut } from 'next-auth/react';

const Logoutbutton = ({children}:{children:React.ReactNode}) => {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    router.refresh()
  };
  return (
    <span onClick={handleLogout} className="cursor-pointer">
      {children}
    </span>

  )
}

export default Logoutbutton