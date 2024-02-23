/**
 * @file /collections/search/page.tsx
 * @fileoverview page containing the list of site ready 3D models, for when users visit /collections/search
 */

import { getAllSiteReadyModels } from "@/api/queries";
import { SiteReadyModels } from "@/api/types";
import Header from "@/components/Header/Header";
import SearchPageContent from "@/components/Search/SearchPageContent";

const getUniqueModeledBy = (models: { modeled_by: string; }[]): string[] => {
  const uniqueModelers = models.reduce((acc: Record<string, boolean>, model) => {
    if (!acc[model.modeled_by]) {
      acc[model.modeled_by] = true;
    }
    return acc;
  }, {} as Record<string, boolean>);

  return Object.keys(uniqueModelers);
};


const getUniqueAnnotators = (models: SiteReadyModels[]): string[] => {
  const uniqueAnnotators = new Set<string>();
  models.forEach(model => {
    model.annotations?.forEach(annotation => {
      if (annotation.photo_annotation && annotation.photo_annotation.annotator) {
        uniqueAnnotators.add(annotation.photo_annotation.annotator);
      }
    });
  });

  return Array.from(uniqueAnnotators);
};


const SearchPage = async () => {

  const siteReadyModels: SiteReadyModels[] = await getAllSiteReadyModels();
  let modeledByList: string[] = getUniqueModeledBy(siteReadyModels);
  modeledByList.unshift("All");
  let annotatedByList: string[] = getUniqueAnnotators(siteReadyModels);
  annotatedByList.unshift("All");

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium Model Search Page</title>
      <Header headerTitle="Model Search" pageRoute="collections" />
      <SearchPageContent modeledByList={modeledByList} annotatedByList={annotatedByList} siteReadyModels={siteReadyModels} />
    </>
  );
};

export default SearchPage;