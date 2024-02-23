/**
 * @file /app/inaturalist/[specimenName]/loading.tsx
 * @fileoverview loading component for when users visit /inaturalist/[specimenName]
 */

'use client';

import React from 'react';

import Header from '@/components/Header/Header';

import { Spinner } from "@nextui-org/react";
import Foot from '@/components/Shared/Foot';


const Loading = () => {
  return (
    <>
      <Header headerTitle="iNaturalist" pageRoute='inaturalist' />
      <div className="flex justify-center items-center" style={{ height: `calc(100vh - 64px - 112px)` }}>
        <Spinner label="Loading..." />
      </div>
      <Foot />
    </>
  )
};

export default Loading;