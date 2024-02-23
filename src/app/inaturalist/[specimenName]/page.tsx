/**
 * @file app/inaturalist/page.tsx
 * @fileoverview contains the page that loads when visiting /inaturalist/{specimen_name}
 */

import {
  getSearchParams, fetchSpecimenGbifInfo,
  fetchCommonNameInfo, fetchSpecimenObservations,
  fetchSpeciesList, fetchSpecimenIdentificationsLeaders,
  fetchSpecimenObservationsLeaders
} from "@/api/fetchFunctions";
import { getAllSiteReadyModels, getModel } from "@/api/queries";
import { GbifResponse, SiteReadyModels, SpeciesListInfo, iNatSpecimenLeader, iNatSpecimenObservation } from "@/api/types";

import Foot from "@/components/Shared/Foot";
import Header from '@/components/Header/Header';
import PageWrapper from "@/components/Shared/PageWrapper";
import INatInfo from "@/components/iNaturalist/INatInfo";


const iNatSpecimenPage = async ({
  params,
  searchParams,
}: {
  params: { specimenName: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) => {

  const specimenName: string = params.specimenName || '';

  /* Map Settings, pulled from URL params */
  const locationEnable = (searchParams.locationEnable || 'false') as string;
  const searchRadius = (searchParams.searchRadius || '') as string
  const searchGrade = (searchParams.searchGrade || '') as string;
  const date0 = (searchParams.date0 || '') as string;
  const date1 = (searchParams.date1 || '') as string;
  const lat = (searchParams.lat || '') as string;
  const lng = (searchParams.lng || '') as string;

  let isSpeciesOrGenus: boolean = true;
  let isValidSearch: boolean = true;
  let redirectUrl: string | null = null;

  const searchParameters: string = getSearchParams(date0, date1, searchGrade, locationEnable, searchRadius, lat, lng);
  const gbifInfo: { hasInfo: boolean; data?: GbifResponse } = await fetchSpecimenGbifInfo(specimenName);
  const rank: string = gbifInfo.data?.rank ?? '';
  if (!gbifInfo.hasInfo || (rank !== "SPECIES" && rank !== "GENUS")) { // common name search
    isSpeciesOrGenus = false;
    const commonNameInfo = await fetchCommonNameInfo(specimenName);
    if (commonNameInfo.length <= 0) {
      isValidSearch = false; // display a toast error message to the user
    } else {
      redirectUrl = `/common-name/${specimenName}`;
    }
  }

  const has3dModelArray = await getModel(decodeURIComponent(specimenName));
  const has3dModel: boolean = has3dModelArray.length > 0 ? true : false;
  const observationsInfo: iNatSpecimenObservation[] = !isSpeciesOrGenus ? [] : await fetchSpecimenObservations(specimenName, searchParameters);

  const identificationsLeaderInfo: iNatSpecimenLeader[] = await fetchSpecimenIdentificationsLeaders(isSpeciesOrGenus ? specimenName : '', searchParameters, 20);
  const observationsLeaderInfo: iNatSpecimenLeader[] = await fetchSpecimenObservationsLeaders(isSpeciesOrGenus ? specimenName : '', searchParameters, 20);
  let speciesList: SpeciesListInfo[] = [];
  if (gbifInfo.data?.rank === 'GENUS') {
    speciesList = await fetchSpeciesList(gbifInfo.data?.canonicalName)
  }

  const siteReadyModels: SiteReadyModels[] = await getAllSiteReadyModels();

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium iNaturalist - {specimenName}</title>
      <Header headerTitle={specimenName} pageRoute="inaturalist" searchTerm={specimenName} siteReadyModels={siteReadyModels} />
      <PageWrapper>
        <INatInfo redirectUrl={redirectUrl} isValidSearch={isValidSearch} has3dModel={has3dModel} isSpeciesOrGenus={isSpeciesOrGenus} gbifInfo={gbifInfo} specimenName={specimenName}
          observationsInfo={observationsInfo} observationsLeaderInfo={observationsLeaderInfo} identificationsLeaderInfo={identificationsLeaderInfo} speciesList={speciesList} />
        <Foot />
      </PageWrapper>
    </>
  );
};

export default iNatSpecimenPage;