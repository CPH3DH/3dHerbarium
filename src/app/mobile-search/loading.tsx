/**
 * @file /app/mobile-search/page.tsx
 * @fileoverview mobile specific page containing a list of "mobile friendly" 3D models.
 */

'use client';

import React from 'react';

import Header from '@/components/Header/Header';

import { Spinner } from "@nextui-org/react";


const Loading = () => {
  return (
    <>
      <Header headerTitle="Model Search" pageRoute='collections' />
      <br />
      <div className="flex justify-center items-center" style={{ height: `calc(100vh - 64px)` }}>
        <Spinner label="Loading..."/>
      </div>
    </>
  )
};

export default Loading;