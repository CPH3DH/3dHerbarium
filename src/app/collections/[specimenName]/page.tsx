/**
 * @file /app/collections/[specimenName]/page.tsx
 * @fileoverview the collections page for when users are viewing a specific specimen (genus or species).
 * Contains the 3D model (if it exists), images and occurrence map.
 */

import { GbifImageResponse, GbifResponse, SiteReadyModels } from "@/api/types";
import { getModel, getSoftwares, getImageSet, getAllSiteReadyModels } from '@/api/queries'
import { fetchCommonNameInfo, fetchGbifImages, fetchGbifProfile, fetchGbifVernacularNames, fetchSpecimenGbifInfo, fetchWikiSummary, fetchHSCImages } from "@/api/fetchFunctions";

import Header from "@/components/Header/Header";
import Foot from '@/components/Shared/Foot'
import MainWrap from '@/utils/ScreenSizePx';
import { annotationHandler, citationHandler } from "@/utils/modelAnnotations";

type DynamicSearch = {
  params: {
    specimenName: string;
  };
};

const Collections: React.FC<DynamicSearch> = async ({ params }) => {

  let redirectUrl: string | null = null;
  let _3dmodel, hasModel, annotations, citations, softwares, imageSet, gProfile, isLocal: any;
  let gImages: GbifImageResponse[] = [];
  let commonNames: string[] = [];
  let summary: string = '';
  let imageTitle: string = '';

  const gMatch: { hasInfo: boolean; data?: GbifResponse } = await fetchSpecimenGbifInfo(params.specimenName);
  const siteReadyModels: SiteReadyModels[] = await getAllSiteReadyModels();

  if (gMatch.hasInfo && gMatch.data?.rank == "SPECIES" || gMatch.data?.rank == "GENUS") {

    gProfile = await fetchGbifProfile(gMatch.data?.usageKey);
    commonNames = await fetchGbifVernacularNames(gMatch.data?.usageKey)
    summary = await fetchWikiSummary(params.specimenName)
    _3dmodel = await getModel(decodeURI(params.specimenName));
    hasModel = _3dmodel.length > 0 ? true : false;
    isLocal = await fetchHSCImages(decodeURI(params.specimenName));

    if (hasModel) {
      annotations = await annotationHandler(hasModel, _3dmodel);
      citations = await citationHandler(annotations);
      softwares = await getSoftwares(_3dmodel[0].uid);
      imageSet = await getImageSet(_3dmodel[0].uid);
    }

    if (isLocal.length > 0) {
      gImages = isLocal;
      imageTitle = "Images from the Cal Poly Humboldt Vascular Plant Herbarium"
    }
    else {
      gImages = await fetchGbifImages(gMatch.data?.usageKey, gMatch.data?.rank);
      imageTitle = "Images from the Global Biodiversity Information Facility"
    }
  }
  else {
    const commonNameInfo = await fetchCommonNameInfo(params.specimenName);

    if (commonNameInfo.length <= 0) {
      return (
        <>
          <Header siteReadyModels={siteReadyModels} headerTitle={params.specimenName} pageRoute="collections" />
          <div className="h-[calc(100vh-177px)] w-full flex justify-center items-center text-center text-2xl px-5">
            <p>No data found for search term &quot;{decodeURI(params.specimenName)}.&quot; Try a species, genus or vernacular name.</p>
          </div>
          <Foot />
        </>
      )
    }
    else {
      redirectUrl = `/collections/common-name/${params.specimenName}`;
    }
  }
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium Collections</title>

      <Header siteReadyModels={siteReadyModels} searchTerm={params.specimenName} headerTitle={params.specimenName} pageRoute="collections" />

      <MainWrap
        redirectUrl={redirectUrl}
        model={_3dmodel} summary={summary} annotations={annotations}
        commonNames={commonNames} citations={citations}
        gMatch={gMatch} profile={gProfile} softwares={softwares} imageSet={imageSet}
        title0={imageTitle} title1={"Occurrence Map"}
        info={gImages} hasModel={hasModel}
        specimenName={params.specimenName} gbifUsageKey={gMatch.data?.usageKey}>
      </MainWrap>
    </>
  )
}
export default Collections;


