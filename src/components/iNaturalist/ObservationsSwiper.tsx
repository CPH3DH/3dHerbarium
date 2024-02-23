/**
 * @file ObservationsSwiper.tsx
 * @fileoverview Client component which provides the image swiper/carousel on the iNat page
 */

'use client';

import { useEffect, useRef, useState } from 'react';

import { Link } from "@nextui-org/react";
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { Skeleton, Card } from "@nextui-org/react";

import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/autoplay";
import 'swiper/css/pagination';

import { iNatSpecimenObservation } from '@/api/types';
import { useIsClient } from "@/utils/isClient";
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';
import { handleImgClick, handleImgError } from '@/utils/imageHandler';

import blankIcon from '../../../public/blankIcon.jpg';
import noImage from '../../../public/noImage.png';
import { isMobileOrTablet } from '@/utils/isMobile';

type iNatObservationsSwiperProps = {
  info: iNatSpecimenObservation[];
  specimenName: string;
  isLoading: boolean;
}

const ObservationsSwiper: React.FC<iNatObservationsSwiperProps> = (props) => {

  const observationsInfo = props.info;
  const specimenName: string = props.specimenName;
  const isLoading: boolean = props.isLoading;

  const isClient: boolean = useIsClient();

  const swiperRef = useRef<SwiperRef | null>(null);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [swiperHeight, setSwiperHeight] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);

  useEffect(() => {
    if (!isLoading && swiperRef.current) {
      swiperRef.current.swiper.slideTo(0);
    }
  }, [isLoading, swiperRef])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoplay && swiperRef.current) {
        swiperRef.current.swiper.slideNext();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, isLoading]);

  useEffect(() => {
    const handleButtonClick = (event: any) => {
      setIsAutoplay(false);
    };

    const nextButton = document.querySelector('.swiper-button-next');
    const prevButton = document.querySelector('.swiper-button-prev');
    if (nextButton) {
      nextButton.addEventListener('click', handleButtonClick);
    }
    if (prevButton) {
      prevButton.addEventListener('click', handleButtonClick);
    }
    return () => {
      nextButton && nextButton.removeEventListener('click', handleButtonClick);
      prevButton && prevButton.removeEventListener('click', handleButtonClick);
    };
  }, []);

  const updateDimensions = (): void => {
    if (!isClient) return;
    const isLandscape: boolean = window.innerWidth > window.innerHeight;
    const baseHeight: number = isLandscape ? window.innerWidth : window.innerHeight;
    setSwiperHeight(baseHeight - 5);
    setImageHeight(window.outerHeight - 208);
  };

  useEffect(() => {
    if (isClient) {
      window.addEventListener('resize', updateDimensions);
      setSwiperHeight(window.outerHeight - 5);
      setImageHeight(window.outerHeight - 400);

      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [isClient, updateDimensions]);

  return (
    <Swiper
      id='observations-swiper-container-inat'
      ref={swiperRef}
      className='my-1 observations-swiper-inat'
      style={{
        '--swiper-pagination-color': '#004C46',
        '--swiper-pagination-bottom': '10px',
        '--swiper-pagination-bullet-size': '12px',
        maxHeight: `${swiperHeight}px`,
        height: `calc(95vh-150px)`,
      } as any}
      spaceBetween={0}
      slidesPerView={1}
      navigation={true}
      keyboard={true}
      cssMode={isMobileOrTablet() ? true : false}
      pagination={{ clickable: true, dynamicBullets: true, type: 'bullets', }}
      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      mousewheel={{
        forceToAxis: true,
        sensitivity: 0.9,
        thresholdDelta: 12.5,
        thresholdTime: 50,
      }}
      breakpoints={{
        600: { // mobile devices
          slidesPerView: 2,
          spaceBetween: 0
        },
        975: { // mobile devices
          slidesPerView: 3,
          spaceBetween: 0
        },
        1280: { // most laptops
          slidesPerView: 4,
          spaceBetween: 0
        },
        2600: { // wider screen monitors
          slidesPerView: 5,
          spaceBetween: 0
        },
        6500: { // wtf?
          slidesPerView: 6,
          spaceBetween: 0
        },
      }}
      onSlideChange={() => { setIsAutoplay(false); }}
      onScroll={() => { setIsAutoplay(false); }}
      onTouchStart={() => { setIsAutoplay(false); }}
      onClick={() => { setIsAutoplay(false); }}
    >
      <section id='swiper-slides-inat' className='rounded'>
        <div className='mx-7 rounded-md overflow-hidden'>
          {!isLoading && observationsInfo.map((observation, index: number) => {
            return (
              <SwiperSlide key={index} className='noselect swiper-slide-custom px-1.5 pb-10 sm:px-2.5'>
                <article className='rounded-md overflow-hidden'>
                  <section id={'observation-info-card' + index} className='rounded shadow-md mx-auto'>
                    <img
                      alt={'Specimen Observation Photo ' + index}
                      role='button'
                      src={observation.photoUrl}
                      className={`w-full sm:h-[calc(100vh-300px)] h-[calc(90vh-300px)] sm:min-h-[25rem] min-h-[20rem] rounded-t-md relative z-5`}
                      style={{ maxHeight: `${imageHeight}px` }}
                      onClick={() => { handleImgClick(observation.pictureHrefLink); }}
                      onError={(e) => { handleImgError(e.currentTarget, noImage); }}
                    />
                  </section>
                  <section className='min-h-[10rem] bg-[#98B8AD] dark:bg-[#3d3d3d] opacity-[0.99] px-5 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center '>
                    <p className='font-medium text-black dark:text-white text-xl'>{decodeURIComponent(toUpperFirstLetter(observation.title)) || decodeURIComponent(toUpperFirstLetter(specimenName))}</p>
                    <p className='text-black dark:text-white h-[50px] overflow-auto'>{observation.location}</p>
                    <p className='text-black dark:text-white mb-1'>{observation.observedOnDate}</p>
                    <section className='flex items-center space-x-0.5rem'>
                      <Link
                        href={'https://www.inaturalist.org/observations/' + observation.userHrefLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[#002923] dark:text-[#C3D5D1]'
                        onFocus={(e) => {
                          if (swiperRef.current) {
                            const slide = e.currentTarget.closest('.swiper-slide');
                            if (slide && slide.parentElement) {
                              const slideIndex = Array.from(slide.parentElement.children).indexOf(slide);
                              if (slideIndex !== swiperRef.current.swiper.activeIndex) {
                                swiperRef.current.swiper.slideTo(slideIndex);
                                setIsAutoplay(false);
                              }
                            }
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            role='button'
                            alt={'iNaturalist User Photo ' + index}
                            src={observation.userIcon}
                            className='w-6 h-6 rounded'
                            onError={(e) => { handleImgError(e.currentTarget, blankIcon); }}
                          />
                          <span>&nbsp;&nbsp;{observation.userHrefLink}</span>
                        </div>
                      </Link>
                    </section>
                  </section>
                </article>
              </SwiperSlide>
            )
          })}
          {isLoading &&
            Array.from({ length: 10 }, (_, index: number) => index).map((_, index: number) => {
              return (
                <SwiperSlide key={index} className='noselect swiper-slide-custom px-1.5 pb-10 sm:px-2.5'>
                  <article className='rounded-md overflow-hidden'>
                    <Card className='rounded shadow-md mx-auto'>
                      <Skeleton
                        className='w-full sm:h-[calc(100vh-300px)] h-[calc(90vh-300px)] min-h-[25rem] rounded-t-md relative z-5'
                        style={{ maxHeight: `${imageHeight}px` }}
                      >
                        <div className='w-full h-[calc(95vh-300px)] min-h-[25rem] rounded-t-md relative z-5'></div>
                      </Skeleton>
                    </Card>
                    <Card className='min-h-[10rem] bg-[#98B8AD] dark:bg-[#3d3d3d] opacity-[0.99] px-5 py-2 rounded-none text-center relative z-10 flex flex-col justify-center items-center space-y-1.5'>
                      <Skeleton className='w-[50%] h-8 rounded'><div className='w-[50%] h-8 rounded'></div></Skeleton>
                      <Skeleton className='w-[65%] h-6 rounded'><div className='w-[65%] h-6 rounded'></div></Skeleton>
                      <br />
                      <Skeleton className='w-[40%] h-3 rounded'><div className='w-[40%] h-3 rounded'></div></Skeleton>
                      <Skeleton className='w-[45%] h-2 rounded'><div className='w-[45%] h-2 rounded'></div></Skeleton>
                    </Card>
                  </article>
                </SwiperSlide>
              )
            })
          }
        </div>
      </section>
    </Swiper>
  );

};

export default ObservationsSwiper;