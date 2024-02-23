/**
 * @file ObservationsMap.tsx
 * @fileoverview Client component which provides the Leaflet map. The map displays the GBIF and iNAT tiles for the specimen.
 */

'use client';

import Map from '@/components/Map';
import { SetStateAction, useEffect, useState } from 'react';
import { TileLayer, LayersControl } from 'react-leaflet';
import SettingsIcon from '../../../public/SettingsIcon';
import MapModal from '@/components/iNaturalist/MapModal';
import { getSearchParams } from '@/api/fetchFunctions';
import { useSearchParams } from 'next/navigation';
import { useIsClient } from '@/utils/isClient';
import { scrollToElement } from '@/utils/scrollToElement';


type ObservationMapProps = {
  specimenName: string;
  gbifUsageKey: number | undefined;
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
};

const ObservationMap: React.FC<ObservationMapProps> = (props) => {

  const isClient: boolean = useIsClient();

  const searchParams = useSearchParams();

  const date0: string = searchParams.get('date0') || '';
  const date1: string = searchParams.get('date1') || ''
  const searchGrade: string = searchParams.get('searchGrade') || '';
  const locationEnable: string = searchParams.get('locationEnable') || '';
  const searchRadius: string = searchParams.get('searchRadius') || '';

  const searchGradeParams: string = getSearchParams(date0, date1, searchGrade, locationEnable, searchRadius);

  const specimenName: string = props.specimenName || '';
  const gbifUsageKey: number | undefined = props.gbifUsageKey || 0;

  const plantaeTaxonId: number = 47126;
  const iNatTileUrl: string = specimenName && gbifUsageKey
    ? 'https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png?has[]=photos&taxon_id=' + plantaeTaxonId + '&taxon_name=' + specimenName + searchGradeParams
    : '';
  const [showModal, setShowModal] = useState<boolean>(false);
  const [viewportHeightInPx, setViewportHeightInPx] = useState<number>(isClient ? window.outerHeight + 200 : 0);
  const [height, setHeight] = useState<string>('calc(100vh - 100px)');

  const isLoading: boolean = props.isLoading;
  const setIsLoading: React.Dispatch<SetStateAction<boolean>> = props.setIsLoading;

  const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
  const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
  const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const tileUrl: string = prefersDarkMode ? darkModeTiles : lightModeTiles

  const updateDimensions = (): void => {
    if (!isClient) return;
    setViewportHeightInPx(window.outerHeight + 200);
    if (window.innerWidth <= 768) {
      setHeight('calc(100vh - 200px)');
    } else {
      setHeight('calc(100vh - 120px)');
    }
  };

  useEffect(() => {
    if (isClient) {
      window.addEventListener('resize', updateDimensions);
      if (window.innerWidth <= 768) {
        setHeight('calc(100vh - 200px)');
      } else {
        setHeight('calc(100vh - 120px)');
      }
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [isClient, updateDimensions]);

  return (
    <div className='relative w-full h-full flex flex-col'>

      {showModal && (
        <div className='absolute inset-0 bg-black opacity-50 z-10'></div>
      )}

      <div className="relative w-full sm:px-8 px-0 sm:py-8 py-0 rounded">
        <Map className='inat-map' setIsLoading={setIsLoading} center={[40, -35]} height={`${height}`} maxHeight={`${viewportHeightInPx}px`} zoom={2.5} scrollWheelZoom={false}>
          {() => (
            <>
              <TileLayer
                url={tileUrl}
                attribution="Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
              />
              <LayersControl position='topleft'>
                <LayersControl.Overlay checked name={`<span style={{ fontFamily: 'Times, Times New Roman, serif', fontWeight: 'bold', fontSize: '110%' }}>iNaturalist</span>`}>
                  <TileLayer url={iNatTileUrl} attribution="<a href='iNaturalist.org' rel='noopener noreferrer'>iNaturalist.org</a>" />
                </LayersControl.Overlay>
              </LayersControl>
            </>
          )}
        </Map>

        <MapModal showModal={showModal} setShowModal={setShowModal} isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>

      <div className="absolute z-10 sm:top-10 top-2 sm:right-[42.5px] right-[5px]">
        <button
          id="map-more-options-button"
          onClick={() => { scrollToElement('map-section-div'); setShowModal(true); }}
          disabled={showModal}
          className="bg-white border-2 border-gray-500 border-opacity-50 text-white font-bold py-2 px-4 rounded">
          <SettingsIcon />
        </button>
      </div>

    </div>
  );
};

export default ObservationMap;