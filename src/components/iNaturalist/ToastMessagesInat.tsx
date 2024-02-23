/**
 * @file /components/iNaturalist/ToastMessagesInat.tsx
 * @fileoverview client component sued to display a toast message on the iNaturalist page.
 */

'use client';

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type ToastMessagesInatProps = {
  isValidSearch: boolean;
  has3dModel: boolean;
}

const ToastMessagesInat = (props: ToastMessagesInatProps) => {

  useEffect(() => {
    if (!props.isValidSearch) {
      toast.error("Search for a flora species or genus only!", {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
    if (props.has3dModel) {
      toast.info('3D Model available! Go to the Collections Page to see it.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  }, [props.has3dModel, props.isValidSearch])

  return <></>

};

export default ToastMessagesInat;