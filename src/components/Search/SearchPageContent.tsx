/**
 * @file /components/Search/SearchPageContent.tsx
 * @fileoverview list of 3D models available on the site.
 */

'use client';

import { useEffect, useState } from "react";
import PageWrapper from "../Shared/PageWrapper";
import SearchPageModelList from "./SearchPageModelList";
import SubHeader from "./SubHeader";
import { SiteReadyModels } from "@/api/types";
import { toast } from "react-toastify";
import Foot from "../Shared/Foot";


type SearchPageContentProps = {
  siteReadyModels: SiteReadyModels[];
  modeledByList: string[];
  annotatedByList: string[];
};

const SearchPageContent = (props: SearchPageContentProps) => {

  const siteReadyModels: SiteReadyModels[] = props.siteReadyModels;
  const modeledByList: string[] = props.modeledByList;
  const annotatedByList: string[] = props.annotatedByList;

  const [selectedModeler, setSelectedModeler] = useState<string | undefined>('');
  const [selectedAnnotator, setSelectedAnnotator] = useState<string | undefined>('');

  const handleModelerSelect = (modeler: string | undefined): void => {
    setSelectedModeler(modeler);
  };

  const handleAnnotatorSelect = (annotator: string | undefined): void => {
    setSelectedAnnotator(annotator);
  };

  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <>
      <SubHeader modeledByList={modeledByList} annotatedByList={annotatedByList} handleModelerSelect={handleModelerSelect} handleAnnotatorSelect={handleAnnotatorSelect} />
      <br />
      <PageWrapper>
        <SearchPageModelList models={siteReadyModels} selectedModeler={selectedModeler} selectedAnnotator={selectedAnnotator} />
        <br />
        <Foot />
      </PageWrapper>
    </>
  )
};

export default SearchPageContent;