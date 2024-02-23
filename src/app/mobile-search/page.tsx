/**
 * @file /app/mobile-search/page.tsx
 * @fileoverview Mobile Search page, /mobile-search
 */

import { SiteReadyModels } from "@/api/types";
import Header from "@/components/Header/Header";
import MobileSearchPageContent from "@/components/Search/MobileSearchPageContent";

const models: SiteReadyModels[] = [
  {
    uid: '709cd4b1e7c54157b0c1ebe25eb37f22',
    spec_name: 'Gaultheria shallon',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'Salal',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
  {
    uid: 'd76a0ccd8d3e47ef9696b04650c9855d',
    spec_name: 'Phoradendron leucarpum',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'American mistletoe',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
  {
    uid: 'a8649632c78f478e9c4ce826a012873f',
    spec_name: 'Sisyrinchium bellum',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'Western blue eyed grass',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
  {
    uid: '2860b067be55466f8884551985b1aa20',
    spec_name: 'Vaccinium ovatum',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'Evergreen huckleberry',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
  {
    uid: 'e088800a7733472aaa95dbc393ee6932',
    spec_name: 'Iris chrysophylla',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'Yellow flowered iris',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
  {
    uid: '6a7b87e2ff98433daa34b3da43092f86',
    spec_name: 'Acer macrophyllum',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'Big leaf maple',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
  {
    uid: '428dbf7d4e4f49978cba34cd0f67f32f',
    spec_name: 'Calocedrus decurrens',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'Incense cedar',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
  {
    uid: '0115aa9368f74da8b9d2b1889f898fe5',
    spec_name: 'Sequoia sempervirens',
    spec_acquis_date: new Date(),
    modeled_by: '',
    site_ready: true,
    pref_comm_name: 'Coast Redwood',
    base_model: null,
    annotated: null,
    annotation: null,
    build_process: null,
  },
];

const SearchPage = async () => {

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium Mobile Friendly Models</title>
      <Header headerTitle="Model Search" pageRoute="collections" />
      <br />
      <MobileSearchPageContent models={models} />
    </>
  );
};

export default SearchPage;