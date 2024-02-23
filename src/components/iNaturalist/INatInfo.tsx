/**
 * @file /components/iNaturalist/INatInfo.tsx
 * @fileoverview the client wrapper for iNaturalist containing the components used on the page.
 */

'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { iNatSpecimenObservation, iNatSpecimenLeader, SpeciesListInfo, GbifResponse } from "@/api/types";

import ToastMessagesInat from "./ToastMessagesInat";

const ComponentDivider = dynamic(() => import('../Shared/ComponentDivider'));
const ObservationsSwiper = dynamic(() => import("./ObservationsSwiper"));
const ObservationsMap = dynamic(() => import("./ObservationsMap"));
const LeaderboardTable = dynamic(() => import("./LeaderboardTable"));
const SpeciesListSwiper = dynamic(() => import("./SpeciesListSwiper"));

type INatInfoProps = {
  redirectUrl: string | null;
  isValidSearch: boolean;
  has3dModel: boolean;
  isSpeciesOrGenus: boolean;
  gbifInfo: { hasInfo: boolean; data?: GbifResponse };
  specimenName: string;
  observationsInfo: iNatSpecimenObservation[];
  observationsLeaderInfo: iNatSpecimenLeader[];
  identificationsLeaderInfo: iNatSpecimenLeader[];
  speciesList: SpeciesListInfo[];
};

const INatInfo = (props: INatInfoProps) => {

  const router = useRouter();
  const redirectUrl: string | null = props.redirectUrl;

  const has3dModel: boolean = props.has3dModel;
  const isValidSearch: boolean = props.isValidSearch;

  const specimenName: string = props.specimenName;
  const isSpeciesOrGenus: boolean = props.isSpeciesOrGenus;
  const gbifInfo: { hasInfo: boolean; data?: GbifResponse } = props.gbifInfo;

  const observationsInfo: iNatSpecimenObservation[] = props.observationsInfo;

  const observationsLeaderInfo: iNatSpecimenLeader[] = props.observationsLeaderInfo;
  const identificationsLeaderInfo: iNatSpecimenLeader[] = props.identificationsLeaderInfo;

  const speciesList: SpeciesListInfo[] = props.speciesList;

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
  }, [props]);

  return (
    <>
      <section id='inat-swiper-and-map'>
        <ToastMessagesInat isValidSearch={isValidSearch} has3dModel={has3dModel} />
        <br />
        <section id='observation-info-swiper-container' className='pb-3 px-4'>
          {observationsLeaderInfo.length > 0 && !redirectUrl &&
            <ObservationsSwiper info={observationsInfo} specimenName={specimenName} isLoading={isLoading} />
          }
          {observationsLeaderInfo.length <= 0 &&
            <div className='h-[34.9rem] rounded mx-auto flex items-center justify-center'>
              <p className='text-2xl py-2 px-2.5 md:px-4'>No observations within specified parameters!</p>
            </div>
          }
        </section>
        <div className='h-0' id='map-section-div'></div>
        <ComponentDivider title={"Density Map"} />
        <section id='observation-info-map-container' className='h-[100%]'>
          <ObservationsMap specimenName={isSpeciesOrGenus ? specimenName : ''} gbifUsageKey={gbifInfo.hasInfo && isSpeciesOrGenus ? gbifInfo.data?.usageKey : undefined}
            isLoading={isLoading} setIsLoading={setIsLoading} />
        </section>
      </section>

      <section id='inat-leaders-and-species-list'>
        {identificationsLeaderInfo.length > 0 &&
          <>
            <ComponentDivider title={"Leaderboards"} />
            <section id='leaderboard-info-table-container' className='pb-1 pt-2'>
              <LeaderboardTable observationsInfo={observationsLeaderInfo} identificationsInfo={identificationsLeaderInfo} isLoading={isLoading} />
            </section>
          </>
        }
        <section id='species-list' className='pb-3'>
          {gbifInfo.data?.rank === "GENUS" && !isLoading &&
            <>
              <ComponentDivider title={`Species List for Genus: ${gbifInfo.data?.canonicalName}`} />
              <br />
              <section className='px-4'>
                <SpeciesListSwiper speciesList={speciesList} />
                <br />
              </section>
            </>
          }
        </section>
      </section>
    </>
  );
};

export default INatInfo;