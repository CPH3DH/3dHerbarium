"use client";

import { useEffect, useState } from 'react';
import SFAPI from '@/components/Collections/SketchFabAPI';
import ComponentDivider from '@/components/Shared/ComponentDivider';
import OccurrenceSwiper from "@/components/Collections/GbifSwiper";
import OccurrenceMap from "@/components/Collections/CollectionsMap";
import Foot from '@/components/Shared/Foot';
import { toast } from 'react-toastify';
import { Switch } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useIsClient } from "@/utils/isClient";

export default function MainWrap(props: any) {

  const redirectUrl: string | null = props.redirectUrl;
  const router = useRouter();

  const mediaQuery = window.matchMedia('(max-width: 1023.5px)');
  //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  var modelHeight = mediaQuery.matches ? "calc(100vh - 250px)" : "calc(100vh - 104.67px)";
  //var mobileModelDiv = isMobile ? "flex" : "hidden";

  const [isSelected, setIsSelected] = useState(true);

  const [viewWidthInPx, setViewWidthInPx] = useState(window.outerWidth);
  const [viewportHeightInPx, setViewportHeightInPx] = useState(window.outerHeight + 200);
  const [swiperHeight, setSwiperHeight] = useState(window.outerHeight - 96);
  const [imgHeight, setImageHeight] = useState(window.outerHeight - 208);

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]);

  window.onresize = () => {
    setTimeout(() => {
      setViewportHeightInPx(window.outerHeight + 200);
    }, 100)
    setTimeout(() => {
      setViewWidthInPx(window.outerWidth);
    }, 100)
    setTimeout(() => {
      setSwiperHeight(window.outerHeight);
    }, 100);
    setTimeout(() => {
      setImageHeight(window.outerHeight - 112);
    }, 100);
  }

  useEffect(() => {
    toast.dismiss();
  }, []);

  const isClient: boolean = useIsClient();
  var screenSize: boolean = isClient ? window.matchMedia(("(max-width: 768px)")).matches : false;
  var txtSize: string = screenSize ? "1rem" : "1.4rem";

  return <>
    {props.hasModel &&
      <>
        <div className="hidden lg:flex h-10 bg-[#00856A] dark:bg-[#212121] text-white items-center justify-between ">
          <p style={{ paddingLeft: "2.5%" }}>Also on this page: <a className="mx-4" href="#imageSection"><u>Images</u></a> <a href="#mapSection"><u>Occurrence Map</u></a></p>
          <Switch style={{ paddingRight: "2.5%" }} defaultSelected id="annotationSwitch" isSelected={isSelected} color='secondary' onValueChange={setIsSelected}>
            <span className="text-white">Annotations</span>
          </Switch>
        </div>
        <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: viewWidthInPx, margin: "0 auto !important" }}>
          <div style={{ height: modelHeight, maxHeight: viewportHeightInPx }}>
            <SFAPI
              model={props.model ? props.model[0] : null} summary={props.summary} annotations={props.annotations} commonNames={props.commonNames} citations={props.citations} gMatch={props.gMatch} profile={props.profile} softwares={props.softwares} imageSet={props.imageSet} />
          </div>
          <div style={{ fontSize: txtSize, borderTop: '0.5px solid #3d3d3d', borderBottom: '0.5px solid #3d3d3d' }} className={`flex h-16 lg:hidden bg-[#004C46] dark:bg-[#212121] text-white justify-center items-center text-center`}>
            <p>Some 3D Models may be too large for mobile devices. Click <a href='/mobile-search'><u>here</u></a> for mobile-friendly models.</p>
          </div>
          {/* Tailwind utility class "mb" was literally broken here. Anything less than mb-4 was treated as zero margin. Only style would work. */}
          <div id="imageSection" style={{ marginBottom: "14px" }} className="mt-4">
            <ComponentDivider title={props.title0} />
          </div>
          <div style={{ maxHeight: viewportHeightInPx }}>
            <OccurrenceSwiper
              info={props.info} swiperHeight={swiperHeight} imageHeight={imgHeight} />
          </div>
          <div className="mt-4">
            <ComponentDivider title={props.title1} />
          </div>
          <div id="mapSection" style={{ height: "calc(100vh - 176px)", maxHeight: viewportHeightInPx }}>
            <OccurrenceMap specimenName={props.specimenName} gbifUsageKey={props.gbifUsageKey} />
          </div>
          <Foot />
        </div>
      </>
    }
    {!props.hasModel &&
      <>
        <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: viewWidthInPx, margin: "0 auto !important" }}>
          {/* lg breakpoint in tailwind not working here, hence id and hard coded breakpoint in globals */}
          <div id='tailwindBroken' className="h-14 !lg:h-8 bg-[#00856A] dark:bg-[#3d3d3d] text-white flex justify-center items-center text-center">
            <p><i>{`"${decodeURI(props.specimenName)}" `}</i>{`${props.title0}`}</p>
          </div>
          <div style={{ maxHeight: viewportHeightInPx }}>
            <OccurrenceSwiper
              info={props.info} swiperHeight={swiperHeight} imageHeight={imgHeight} />
          </div>
          <div className="mt-4">
            <ComponentDivider title={props.title1} />
          </div>
          <div id="mapSectionNoModel" style={{ height: "calc(100vh - 176px)", maxHeight: viewportHeightInPx }}>
            <OccurrenceMap specimenName={props.specimenName} gbifUsageKey={props.gbifUsageKey} />
          </div>
          <Foot />
        </div>
      </>
    }
  </>
}


