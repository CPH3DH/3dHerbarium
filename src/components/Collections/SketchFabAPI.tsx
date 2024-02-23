/**
 * @file SketchFabAPI.tsx
 * @fileoverview Client component which renders the 3D models and annotations.
 */

"use client";

import Sketchfab from '@sketchfab/viewer-api';
import { useEffect, useState } from 'react';
import AnnotationModal from '@/components/Collections/AnnotationModal';
import { setViewerWidth, annotationControl, boolRinse, addCommas, arrayFromObjects, getAnnotator } from './SketchfabDom';
import ModelAnnotation from './AnnotationModel';
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';

type sfapiProps = {
  model: any;
  annotations: any[];
  citations: any[];
  gMatch: any;
  profile: any;
  softwares: any,
  imageSet: any
  commonNames: string[];
  summary?: any;
}

const SFAPI: React.FC<sfapiProps> = (props) => {
  var [index, setIndex] = useState<number | null>(null);
  var [mobileIndex, setMobileIndex] = useState<number | null>(null);

  const successObj = {
    success: function onSuccess(api: any) {
      api.start();
      api.addEventListener('viewerready', function () {
        const annotationSwitch = document.getElementById("annotationSwitch");
        const annotationSwitchMobile = document.getElementById("annotationSwitchMobileHidden");
        const annotationDiv = document.getElementById("annotationDiv");
        const modelViewer = document.getElementById("model-viewer");

        api.getAnnotationList(function (err: any, annotations: any) {
          if (!err) { }

          if (annotationSwitch) {
            annotationSwitch.addEventListener("change", (event: Event) => {
              setViewerWidth(modelViewer, annotationDiv, (event.target as HTMLInputElement).checked)
              annotationControl(api, annotations, (event.target as HTMLInputElement).checked)
            })
          }

          if (annotationSwitchMobile) {
            annotationSwitchMobile.addEventListener("change", (event: Event) => {
              setViewerWidth(modelViewer, annotationDiv, (event.target as HTMLInputElement).checked)
              annotationControl(api, annotations, (event.target as HTMLInputElement).checked)
            })
          }
        });

        api.addEventListener('annotationSelect', function (index: number) {
          const mediaQueryWidth = window.matchMedia('(max-width: 1023.5px)');
          const mediaQueryOrientation = window.matchMedia('(orientation: portrait)');

          if (index != -1) {
            setIndex(index);
          }

          if (index != -1 && mediaQueryWidth.matches || index != -1 && mediaQueryOrientation.matches) {
            document.getElementById("annotationButton")?.click();
            api.getAnnotation(index, function (err: any, information: any) {
              if (!err) {
                setAnnotationTitle(information.name);
                setMobileIndex(index);
              }
            });
          }
        });
      });
    },
    error: function onError() { },
    ui_stop: 0,
    ui_infos: 0,
    ui_inspector: 0,
    ui_settings: 0,
    ui_watermark: 0,
    ui_annotations: 0,
    ui_color: "004C46",
    ui_fadeout: 0
  }

  const successObjDesktop = { ...successObj };
  //@ts-ignore
  successObjDesktop.annotation = 1;
  successObjDesktop.ui_fadeout = 1;

  var [annotationTitle, setAnnotationTitle] = useState("");

  const handlePageLoad = () => {
    const sketchFabLink = props.model.uid;
    const iframe = document.getElementById('model-viewer') as HTMLIFrameElement;

    if (iframe) { iframe.src = sketchFabLink; }
    else return;

    const client = new Sketchfab(iframe);

    if (window.matchMedia('(max-width: 1023.5px)').matches
      || window.matchMedia('(orientation: portrait)').matches
    ) {
      client.init(sketchFabLink, successObj);
    }
    else {
      client.init(sketchFabLink, successObjDesktop);
    }
  };

  useEffect(() => {
    handlePageLoad();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      <AnnotationModal {...props} title={annotationTitle} index={mobileIndex} />

      <div id="iframeDiv" className="flex bg-black m-auto min-h-[150px]" style={{ height: "100%", width: "100%" }}>
        <iframe src="" frameBorder="0" id="model-viewer" title={"Model Viewer for " + ''}
          allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking="true"
          execution-while-out-of-viewport="true" execution-while-not-rendered="true" web-share="true"
          allowFullScreen
          style={{ width: "60%", transition: "width 1.5s", zIndex: "2" }}
        />
        <div id="annotationDiv" style={{ width: "40%", backgroundColor: "black", transition: "width 1.5s", color: "#F5F3E7", zIndex: "1", overflowY: "auto", overflowX: "hidden" }}>

          {index == 0 &&

            <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
              <div className='fade flex w-[99%] mt-[25px]'>
                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                  <p> Classification </p>
                </div>
                <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                  <p>Species: <i><span className='text-[#FFC72C]'>{props.gMatch.data.species}</span></i></p>
                  <p>Kingdom: {props.gMatch.data.kingdom}</p>
                  <p>Phylum: {props.gMatch.data.phylum}</p>
                  <p>Order: {props.gMatch.data.order}</p>
                  <p>Family: {props.gMatch.data.family}</p>
                  <p>Genus: <i>{props.gMatch.data.genus}</i></p>
                </div>
              </div>

              <div className='fade flex w-[99%] mt-[25px]'>
                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                  <p> Profile </p>
                </div>
                <div className='w-[65%] py-[20px] justify-center items-center text-center px-[2%]'>
                  {props.commonNames.length > 1 && <p>Common Names: {addCommas(props.commonNames)}</p>}
                  {props.commonNames.length == 1 && <p>Common Names: {props.commonNames[0]}</p>}
                  {props.profile.extinct !== '' && <p>Extinct: {boolRinse(props.profile.extinct)}</p>}
                  {props.profile.habitat && <p>Habitat: {toUpperFirstLetter(props.profile.habitat)}</p>}
                  {props.profile.freshwater !== '' && <p>Freshwater: {boolRinse(props.profile.freshwater)}</p>}
                  {props.profile.marine !== '' && <p>Marine: {boolRinse(props.profile.marine)}</p>}
                </div>
              </div>

              <div className='fade flex w-[99%] mt-[25px]'>
                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                  <p> 3D Model </p>
                </div>
                <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                  <p>Build method: {props.model.build_process}</p>
                  <p>Created with: {arrayFromObjects(props.softwares)}</p>
                  <p>Images: {props.imageSet[0].no_of_images}</p>
                  <p>Modeler: {props.model.modeled_by}</p>
                  <p>Annotator: {getAnnotator(props.citations)}</p>
                </div>
              </div>

              <br></br>

              {props.summary && <br></br>}
              {props.summary && <h1 className='fade text-center text-[1.5rem]'>Description</h1>}
              {props.summary && <p dangerouslySetInnerHTML={{ __html: props.summary.extract_html }} className='fade text-center pr-[1.5%] pl-[0.5%]'></p>}
              {props.summary && <br></br>}
              {props.summary && <p className='fade text-center text-[0.9rem]'>from <a href={props.summary.content_urls.desktop.page} target='_blank'><u>Wikipedia</u></a></p>}

            </div>}

          {!!index && index != 0 && props.annotations[index - 1].annotation_type == 'photo' &&
            <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
              <div className='w-full h-full text-center fade'>
                <img key={Math.random()} className='fade center w-[98%] h-full pr-[2%] pt-[1%]' src={encodeURI(decodeURI(props.annotations[index - 1].url))} alt={`Image for annotation number ${props.annotations[index - 1].annotation_no}`}>
                </img>
              </div>
            </div>}

          {!!index && index != 0 && props.annotations[index - 1].annotation_type == 'model' &&
            <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
              <ModelAnnotation />
            </div>}

          {!!index && index != 0 && props.annotations[index - 1].annotation_type == 'video' &&
            <div className="w-full h-full" id="annotationDivVideo">
              {/*@ts-ignore*/}
              <iframe align='left' className='fade w-[calc(100%-15px)] h-full' src={props.annotations[index - 1].url}></iframe>
            </div>}

          {!!index && index != 0 && props.annotations[index - 1].annotation_type == 'photo' &&
            <div id="annotationDivText">
              <br></br>
              <p dangerouslySetInnerHTML={{ __html: props.citations[index - 1][0].annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
            </div>}

          {!!index && index != 0 && props.annotations[index - 1].annotation_type == 'model' &&
            <div id="annotationDivText">
              <br></br>
              <p dangerouslySetInnerHTML={{ __html: props.citations[index - 1][0].annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
            </div>}

          {!!index && index != 0 && props.annotations[index - 1].annotation_type == 'photo' &&
            <div id="annotationDivCitation">
              <br></br>
              <p className='fade text-center w-[95%]'>Photo by: {props.citations[index - 1][0].author}, licensed under <a href='https://creativecommons.org/share-your-work/cclicenses/' target='_blank'>{props.citations[index - 1][0].license}</a></p>
            </div>}

          {!!index && index != 0 && props.annotations[index - 1].annotation_type == 'model' &&
            <div id="annotationDivCitation">
              <br></br>
              <p className='fade text-center w-[95%]'>Model by David Yaranon</p>
            </div>}
        </div>
      </div>
    </>
  );
};
export default SFAPI;
