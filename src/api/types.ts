/**
 * @file /api/types.ts
 * @fileoverview contains the type definitions of the API calls used throughout the application.
 */

export type iNatApiResponse = {
  total_results: number;
  page: number;
  per_page: number;
  results: any[];
};

export type iNatSpecimenObservation = {
  photoUrl: string;
  title: string;
  userIcon: string;
  pictureHrefLink: string;
  userHrefLink: string;
  observedOnDate: string;
  location: string;
};

export type iNatSpecimenLeader = {
  count?: number;
  observation_count?: number;
  user: string;
};

export type GbifResponse = {
  usageKey?: number;
  scientificName?: string;
  canonicalName?: string;
  rank: 'GENUS' | 'SPECIES';
  status?: string;
  confidence: number;
  matchType: 'EXACT' | 'NONE';
  kingdom?: string;
  phylum?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  kingdomKey?: number;
  phylumKey?: number;
  classKey?: number;
  orderKey?: number;
  familyKey?: number;
  genusKey?: number;
  speciesKey?: number;
  synonym: boolean;
  class?: string;
  note?: string;
  alternatives?: any[];
};

export type GbifMediaResponse = {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count?: number;
  results: any[];
};

export type GbifImageResponse = {
  author: string | null;
  license?: string;
  year?: number;
  month?: number;
  day?: number;
  url: string;
};

export type GbifProfile = {
  habitat?: string;
  extinct?: string;
  terrestrial?: string;
  marine?: string;
  freshwater?: string;
};

export type SpeciesListInfo = {
  name: string;
  imgUrl: string;
  photoBy: string;
  license: string;
};

export type CommonNameInfo = {
  id: number;
  rank: string;
  iconic_taxon_id: number;
  name: string;
  default_photo?: {
    id: number;
    url: string;
    medium_url: string;
    photo_by: string;
    license: string;
  };
  wikipedia_url?: string;
  preferred_common_name: string;
};

export type PlantIdSuggestion = {
  id: number;
  plant_name: string;
  probability: number;
  confirmed: boolean;
  similar_images: {
    id: string;
    url: string;
    similarity?: number;
    url_small?: string;
  }[];
  plant_details: {
    common_names?: string[] | null;
    taxonomy: {
      class: string;
      genus: string;
      order: string;
      family: string;
      phylum: string;
      kingdom: string;
    };
    url: string;
    wiki_description?: {
      value: string;
      citation: string;
      license_name: string;
      license_url: string;
    } | null;
    synonyms?: string[] | null;
    name_authority: string;
    language: string;
    scientific_name: string;
    structured_name: {
      genus: string;
      species?: string; // Optional if present in the response
      hybrid?: string; // Optional if present in the response
    };
  };
};

export type PlantIdApiResponseSuccess = {
  id: number;
  custom_id: null;
  meta_data: {
    latitude: null;
    longitude: null;
    date: string;
    datetime: string;
  };
  uploaded_datetime: number;
  finished_datetime: number;
  images: {
    file_name: string;
    url: string;
  }[];
  suggestions: PlantIdSuggestion[];
  modifiers: string[];
  secret: string;
  fail_cause: null;
  countable: true;
  feedback: null;
  is_plant: true;
  is_plant_probability: number;
};

export type PlantIdApiResponseError = {
  id: number;
  custom_id: null;
  meta_data: {
    latitude: null;
    longitude: null;
    date: string;
    datetime: string;
  };
  uploaded_datetime: number;
  finished_datetime: number;
  images: {
    file_name: string;
    url: string;
  }[];
  suggestions: PlantIdSuggestion[];
  modifiers: string[];
  secret: string;
  fail_cause: null;
  countable: true;
  feedback: null;
  is_plant: false;
  is_plant_probability: number;
};

export type PlantIdApiResponse = PlantIdApiResponseSuccess | PlantIdApiResponseError;

export type SiteReadyModels = {
  uid: string;
  spec_name: string;
  spec_acquis_date: Date;
  modeled_by: string;
  site_ready: boolean;
  pref_comm_name: string;
  base_model: boolean | null;
  annotated: boolean | null;
  annotation: string | null;
  build_process: string | null;
  annotations?: ({
    url: string;
    uid: string;
    annotation_no: number;
    annotation_type: string;
    photo_annotation: {
      url: string;
      website: string | null;
      author: string;
      title: string | null;
      license: string;
      annotator: string;
      annotation: string;
    } | null;
  })[];
};