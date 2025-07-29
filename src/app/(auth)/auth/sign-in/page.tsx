"use client";
import SignInForm from '@/components/SignInForm';
import Image from 'next/image';
import React from 'react'


const SignInPage = () => {
  return (
      <>
        <Image src="/Logo.png" alt="Logo" width={200} height={200} className='rounded-full'/>
        <SignInForm/>
        </>
  )
}

export default SignInPage;