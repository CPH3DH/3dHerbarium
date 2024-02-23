/**
 * @file /component/Search/MobileSearchPageContent.tsx
 * @fileoverview mobile only page listing mobile friendly 3D models
 */

'use client';

import { useEffect } from "react";
import PageWrapper from "../Shared/PageWrapper";
import SearchPageModelList from "./SearchPageModelList";
import { SiteReadyModels } from "@/api/types";
import { toast } from "react-toastify";
import Foot from "../Shared/Foot";


type SearchPageContentProps = {
  models: SiteReadyModels[];
};

const MobileSearchPageContent = (props: SearchPageContentProps) => {

  const models: SiteReadyModels[] = props.models;

  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <PageWrapper>
      <SearchPageModelList models={models} selectedModeler={''} selectedAnnotator={''} />
      <br />
      <Foot />
    </PageWrapper>
  )
};

export default MobileSearchPageContent;