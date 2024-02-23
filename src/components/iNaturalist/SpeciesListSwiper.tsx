/**
 * @file /components/iNaturalist/SpeciesListSwiper.tsx
 * @fileoverview swiper component with a list of species for a given genus.
 */

'use client';

import { useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel, Keyboard, Pagination } from "swiper/modules";

import { SpeciesListInfo } from "@/api/types";
import { handleImgError } from "@/utils/imageHandler";

import noImage from '../../../public/noImage.png';
import { isMobileOrTablet } from "@/utils/isMobile";


const SwiperStyle: any = {
  '--swiper-pagination-color': '#004C46',
  '--swiper-pagination-bottom': '10px',
  '--swiper-pagination-bullet-size': '12px'
};

type SpeciesListSwiperProps = {
  speciesList: SpeciesListInfo[];
};

const SpeciesListSwiper: React.FC<SpeciesListSwiperProps> = (props) => {

  const { speciesList } = props;

  const swiperRef = useRef<SwiperRef | null>(null);

  return (
    <Swiper
      ref={swiperRef}
      className='my-1'
      style={SwiperStyle}
      spaceBetween={0}
      slidesPerView={1}
      navigation={true}
      keyboard={true}
      cssMode={isMobileOrTablet() ? true : false}
      pagination={{ clickable: true, dynamicBullets: true, type: 'bullets', }}
      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      mousewheel={{
        forceToAxis: true,
      }}
      breakpoints={{
        640: { // mobile devices
          slidesPerView: 2,
          spaceBetween: 0
        },
        850: { // mobile devices
          slidesPerView: 3,
          spaceBetween: 0
        },
        1280: { // most laptops
          slidesPerView: 4,
          spaceBetween: 0
        },
        2250: { // wider screen monitors
          slidesPerView: 5,
          spaceBetween: 0
        },
        6500: { // wtf?
          slidesPerView: 6,
          spaceBetween: 0
        },
      }}
    >
      {speciesList.map((species: SpeciesListInfo, idx: number) => (
        <SwiperSlide key={idx} className='pb-10'>
          <section id='swiper-slides-species-inat' className='mx-2 rounded-md overflow-hidden'>
            <div className='noselect swiper-slide-custom'>
              <article className='rounded-md overflow-hidden'>
                <section id='observation-info-card' className='h-[20rem] rounded shadow-md mx-auto'>
                  <a href={"/inaturalist/" + species.name} tabIndex={-1}>
                    <img
                      alt={'Species ' + species.name + idx}
                      role='button'
                      src={species.imgUrl}
                      className='w-full h-full rounded-t-md relative z-5'
                      onError={(e) => { handleImgError(e.currentTarget, noImage); }}
                    />
                  </a>
                </section>
                <section className='bg-[#98B8AD] dark:bg-[#3d3d3d] opacity-[0.99] px-5 py-3 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center h-[10rem] mt-[-10px]'>
                  <section className='flex flex-col items-center'>
                    <a
                      href={"/inaturalist/" + species.name}
                      rel='noopener noreferrer'
                      className='text-[#002923] dark:text-[#C3D5D1] font-bold text-[1.2rem]'
                      onFocus={(e) => {
                        if (swiperRef.current) {
                          const slide = e.currentTarget.closest('.swiper-slide');
                          if (slide && slide.parentElement) {
                            const slideIndex = Array.from(slide.parentElement.children).indexOf(slide);
                            if (slideIndex !== swiperRef.current.swiper.activeIndex) {
                              swiperRef.current.swiper.slideTo(slideIndex);
                            }
                          }
                        }
                      }}
                    >
                      <i>{species.name}</i>
                    </a>
                    <br />
                    <p className='text-black dark:text-white'>License: {species.license}</p>
                    <p className='text-black dark:text-white'>Image by: {species.photoBy}</p>
                  </section>
                </section>
              </article>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );

};

export default SpeciesListSwiper;
