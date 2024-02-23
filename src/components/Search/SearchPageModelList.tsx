import noImage from '../../../public/noImage.png';
import { handleImgError } from '@/utils/imageHandler';

import { MODEL_THUMBNAILS } from '../../utils/modelThumbnails';

import Image from 'next/image';
import { SyntheticEvent } from 'react';
import { SiteReadyModels } from '@/api/types';

type SearchPageModelListProps = {
  models: SiteReadyModels[];
  selectedModeler: string | undefined;
  selectedAnnotator: string | undefined;
};

const SearchPageModelList = (props: SearchPageModelListProps) => {

  const models = props.models;
  const selectedModeler: string | undefined = props.selectedModeler;
  const selectedAnnotator = props.selectedAnnotator;

  const filteredModels = models.filter(model =>
    (selectedModeler === 'All' || selectedModeler === '' || selectedModeler === undefined || model.modeled_by === selectedModeler) &&
    (selectedAnnotator === 'All' || selectedAnnotator === '' || selectedAnnotator === undefined || model.annotations?.some(annotation => annotation.photo_annotation && annotation.photo_annotation.annotator === selectedAnnotator))
  );

  return (
    <>
      {filteredModels && filteredModels.length === 0 &&
        <div className='h-[35rem] rounded mx-auto flex items-center justify-center'>
          <p className='text-2xl px-5'>No models found matching the current filters. Try adjusting your filter settings for broader results.</p>
        </div>
      }
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 gap-4 mx-5'>
        {filteredModels && filteredModels.map((model, index: number) => (
          <div key={index} className='noselect'>
            <article className='rounded-md overflow-hidden mx-1'>
              <section className='rounded shadow-md mx-auto'>
                <a href={"/collections/" + model.spec_name} tabIndex={-1}>
                  <Image
                    alt={'Image of ' + model.spec_name}
                    role='button'
                    src={MODEL_THUMBNAILS[model.uid] ?? ''}
                    className='w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem] object-cover relative z-5 rounded-t-md'
                    onError={(e: SyntheticEvent<HTMLImageElement, Event>) => { handleImgError(e.currentTarget, noImage); }}
                  />
                </a>
              </section>
              <section className='bg-[#98B8AD] dark:bg-[#3d3d3d] h-[5rem] max-h-[calc(100vh-300px)*0.2] opacity-[0.99] px-5 py-3 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center space-y-1.5 mt-[-1px]'>
                <section className='flex items-center space-x-0.5rem'>
                  <a
                    href={"/collections/" + model.spec_name}
                    rel='noopener noreferrer'
                    className='text-[#004C46] dark:text-[#C3D5D1] text-xl'
                  >
                    <i className='text-lg'>{model.spec_name.charAt(0).toUpperCase() + model.spec_name.slice(1)}</i>
                  </a>
                </section>
                <section className='text-sm text-black dark:text-white'>
                  {model.pref_comm_name}
                </section>
              </section>
            </article>
          </div>
        ))}
      </section>
    </>
  );

};

export default SearchPageModelList;