'use client';
import Header from '@/components/Header/Header';
import Footer from '@/components/Shared/Foot';
import dynamic from 'next/dynamic';
import { useIsClient } from "@/utils/isClient";

const HomeModel = dynamic(() => import('@/components/Home/model'),
  { ssr: false });

export default function App() {

  const isClient: boolean = useIsClient();
  var screenSize: boolean = isClient ? window.matchMedia(("(max-width: 768px)")).matches : false;
  var txtSize: string = screenSize ? "1rem" : "1.4rem";
  var screenSizeLarge: boolean = isClient ? window.matchMedia(("(max-width: 1023.5px)")).matches : false;
  var modelHeight = screenSizeLarge ? "calc(100vh - 241px)" : "calc(100vh - 177px)"

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Digital Herbarium</title>
      <Header headerTitle='Home' pageRoute='collections' page="home" />
      <div className='flex flex-col h-auto w-full'>
        <div className='flex' style={{ height: modelHeight }}>
          <HomeModel />
          {/* <div id='sliderDiv' className='hidden overflow-x-auto lg:flex flex-col w-2/5 h-full pr-[4] bg-black items-center pt-[1%] text-white overflow-y-auto' style={{ transition: "width 1.5s", zIndex: "1" }}>
          </div> */}
        </div>
        <div style={{ fontSize: txtSize, borderTop: '0.5px solid #3d3d3d', borderBottom: '0.5px solid #3d3d3d' }} className="h-16 lg:hidden bg-[#004C46] dark:bg-[#212121] text-white flex justify-center items-center text-center ">
            <p>Some 3D Models may be too large for mobile devices. Click <a href='/mobile-search'><u>here</u></a> for mobile-friendly models.</p>
          </div>
      </div>
      <Footer />
    </>
  );
}

