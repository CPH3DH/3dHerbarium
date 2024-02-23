/**
 * @file MapModal.tsx
 * @fileoverview Modal component for displaying map options
 */

'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

type MapParams = {
  locationEnable: string;
  searchRadius: string;
  date0: string;
  date1: string;
  searchGrade: string;
  lat: string;
  lng: string;
}

type MapModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const MapModal: React.FC<MapModalProps> = (props) => {

  const { showModal, setShowModal, isLoading, setIsLoading } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const locationEnable = searchParams.get('locationEnable') || 'false';
  const searchRadius = searchParams.get('searchRadius') || '500';
  const date0 = searchParams.get('date0') || '';
  const date1 = searchParams.get('date1') || '';
  const searchGrade = searchParams.get('searchGrade') || '';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';

  const defaultMapParams: MapParams = { locationEnable: locationEnable, searchRadius: searchRadius, searchGrade: searchGrade, lat: lat, lng: lng, date0: date0, date1: date1 };

  const [mapParams, setMapParams] = useState<MapParams>(defaultMapParams);

  const haveParamsChanged = (currentParams: MapParams, defaultParams: MapParams): boolean => {
    const keysToCompare = Object.keys(defaultParams).filter(key => {
      if (key === 'locationEnable') return false;
      if (key === 'searchRadius' && currentParams.locationEnable === 'false') return false;
      return true;
    });
    return keysToCompare.some(key =>
      defaultParams[key as keyof MapParams] !== currentParams[key as keyof MapParams]
    );
  };

  const handleClose = () => {
    setMapParams(defaultMapParams);
    setShowModal(false);
  }

  const handleParamChange = (param: keyof MapParams, value: string) => {
    setMapParams((prevParams) => ({
      ...prevParams,
      [param]: value,
    }));
  };

  const handleApplySettings = () => {
    if (haveParamsChanged(mapParams, defaultMapParams)) {
      setIsLoading(true);
      // window.scrollTo({ behavior: 'smooth', top: 0 });
    }
    router.replace(`?${new URLSearchParams({
      locationEnable: mapParams.locationEnable,
      searchRadius: mapParams.searchRadius,
      date0: mapParams.date0,
      date1: mapParams.date1,
      searchGrade: mapParams.searchGrade,
      lat: mapParams.lat,
      lng: mapParams.lng
    })}`, { scroll: false });
    setShowModal(false); 
  }

  const handleEnableLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const locationEnableChecked: string = e.target.checked ? 'true' : 'false';
    handleParamChange('locationEnable', locationEnableChecked);
    locationEnableChecked === 'true' &&
      toast.info('Click on the map to drop a pin!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radius: string = e.target.value;
    if (Number(radius) < 1 || Number(radius) > 1000) { return; }
    handleParamChange('searchRadius', radius);
  };

  const handleDate0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    if (value && mapParams.date1 && new Date(value) > new Date(mapParams.date1)) {
      toast.error('Since Date cannot be later than Before Date', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      handleParamChange('date0', value);
    }
  };

  const handleDate1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    if (value && mapParams.date0 && new Date(mapParams.date0) > new Date(value)) {
      toast.error('Before Date cannot be earlier than Since Date', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      handleParamChange('date1', value);
    }
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.currentTarget.id;
    handleParamChange('searchGrade', value);
  };

  return (
    <>
      {showModal &&
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-[#3d3d3d] p-2.5 shadow-lg rounded-xl w-[85%] md:w-[50%] sm:w-[85%]'>
          <ul className='space-y-4 px-1'>
            <li className='text-black dark:text-white'>
              <label htmlFor='locationEnable'>Enable Location Pinning</label>
              <input type='checkbox' name='locationEnable' id='locationEnable' className='mx-1' checked={mapParams.locationEnable === 'true'} onChange={handleEnableLocation} />
            </li>
            <li className={mapParams.locationEnable === 'false' ? 'opacity-50 text-black dark:text-white' : 'opacity-100 text-black dark:text-white'}>
              <label className={mapParams.locationEnable === 'false' ? 'opacity-50' : 'opacity-100'} htmlFor='searchRadius'>Search Location Radius(km): </label>
              <input className='mx-1 p-1 bg-white dark:bg-[#3d3d3d]' disabled={mapParams.locationEnable === 'false'} type='number' name='searchRadius' id='searchRadius' min={1} max={2000} value={mapParams.searchRadius} onChange={handleRadiusChange} />
            </li>
            <li className='text-black dark:text-white'>
              <label htmlFor='date0'>Since Date: </label>
              <input type='date' name='date0' id='date0' className='mx-1 p-1 bg-white dark:bg-[#3d3d3d]' value={mapParams.date0} onChange={handleDate0Change} />
            </li>
            <li className='text-black dark:text-white'>
              <label htmlFor='date1'>Before Date: </label>
              <input type='date' name='date1' id='date1' className='mx-1 p-1 bg-white dark:bg-[#3d3d3d]' value={mapParams.date1} onChange={handleDate1Change} />
            </li>
            <li className='text-black dark:text-white'>
              <label htmlFor='verifiableGrade'>Verifiable</label>
              <input type='radio' name='verifiableGrade' value='verifiableGrade' id='verifiableGrade' className='mx-1' checked={mapParams.searchGrade === 'verifiableGrade'} onChange={handleGradeChange} />
            </li>
            <li className='text-black dark:text-white'>
              <label htmlFor='researchGrade'>Research</label>
              <input type='radio' name='researchGrade' value='researchGrade' id='researchGrade' className='mx-1' checked={mapParams.searchGrade === 'researchGrade'} onChange={handleGradeChange} />
            </li>
            <li className='text-black dark:text-white'>
              <label htmlFor='anyGrade'>Any Grade</label>
              <input type='radio' name='anyGrade' value='anyGrade' id='anyGrade' className='mx-1' checked={mapParams.searchGrade === 'anyGrade'} onChange={handleGradeChange} />
            </li>
          </ul>
          <section id='map-modal-buttons' className='flex gap-1'>
            <button onClick={() => handleApplySettings()} className='bg-[#004C46] dark:bg-[#a5bfb9] hover:bg-[#193d3a] dark:hover:bg-[#89b1a9] text-white font-bold py-2 px-4 rounded mt-4'>Apply Settings</button>
            <button onClick={() => handleClose()} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4'>Close</button>
          </section>
          <p className='px-1 py-2 text-black dark:text-white'>NOTE: Changing these values will update the observations slider and the leaderboards</p>
        </div>
      }
    </>
  );
};

export default MapModal;