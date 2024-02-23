"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { boolRinse, addCommas, arrayFromObjects, getAnnotator } from './SketchfabDom';
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';

type annotationModalProps = {
  model: any;
  annotations: any[];
  citations: any[];
  gMatch: any;
  profile: any;
  softwares: any,
  imageSet: any
  commonNames: string[];
  summary?: any;
  title: string;
  index: number | null;
}

export default function AnnotationModal(props: annotationModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button id="annotationButton" className="hidden" onPress={onOpen}></Button>
      <div id='modalDiv'>
        <Modal className="bg-black text-white justify-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior={"inside"} size="full" placement="top">
          <ModalContent>
            {(onClose) => (
              <>
                {/*@ts-ignore*/}
                <ModalHeader class='fade' className="flex gap-1 w-full items-center">
                  <p className="text-center text-2xl pt-[20px]">{props.title}</p>
                </ModalHeader>
                <ModalBody>
                  {props.index == 0 &&

                    <p id="WhyAreThereThreeZedosAf">
                      <div className="fade w-full flex justify-center items-center pt-[20px] pb-[20px] text-center flex-col">
                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                          <p> Classification </p>
                        </div><br></br>
                        <p>Species: <i><span className='text-[#FFC72C]'>{props.gMatch.data.species}</span></i></p>
                        <p>Kingdom: {props.gMatch.data.kingdom}</p>
                        <p>Phylum: {props.gMatch.data.phylum}</p>
                        <p>Order: {props.gMatch.data.order}</p>
                        <p>Family: {props.gMatch.data.family}</p>
                        <p>Genus: <i>{props.gMatch.data.genus}</i></p>
                      </div>


                      <div className='fade flex w-full justify-center items-center pt-[20px] pb-[20px] text-center flex-col'>
                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                          <p> Profile </p>
                        </div><br></br>
                        {props.commonNames.length > 1 && <p>Common Names: {addCommas(props.commonNames)}</p>}
                        {props.commonNames.length == 1 && <p>Common Names: {props.commonNames[0]}</p>}
                        {props.profile.extinct !== '' && <p>Extinct: {boolRinse(props.profile.extinct)}</p>}
                        {props.profile.habitat && <p>Habitat: {toUpperFirstLetter(props.profile.habitat)}</p>}
                        {props.profile.freshwater !== '' && <p>Freshwater: {boolRinse(props.profile.freshwater)}</p>}
                        {props.profile.marine !== '' && <p>Marine: {boolRinse(props.profile.marine)}</p>}
                      </div>

                      <div className='fade flex w-full justify-center items-center pt-[20px] pb-[20px] text-center flex-col'>
                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                          <p> 3D Model</p>
                        </div><br></br>
                        <p>Build method: {props.model.build_process}</p>
                        <p>Created with: {arrayFromObjects(props.softwares)}</p>
                        <p>Images: {props.imageSet[0].no_of_images}</p>
                        <p>Modeler: {props.model.modeled_by}</p>
                        <p>Annotator: {getAnnotator(props.citations)}</p>
                      </div>

                      {props.summary &&
                        <div className='fade flex w-full justify-center items-center pt-[20px] pb-[20px] text-center flex-col'>
                          <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                            <p>Description</p>
                          </div><br></br>
                          <p dangerouslySetInnerHTML={{ __html: props.summary.extract_html }}></p><br></br>
                          <p className="text-[0.9rem]">from <a href={props.summary.content_urls.desktop.page} target='_blank'><u>Wikipedia</u></a></p>
                        </div>}
                    </p>}

                  {!!props.index && props.annotations[props.index - 1].annotation_type !== 'video' &&

                    <p id="modalMedia2">
                      <div className="fade w-full h-full text-center">
                        <img className="center w-full h-[50vh]" src={encodeURI(decodeURI(props.annotations[props.index - 1].url))} alt={`Annotation number ${props.annotations[props.index - 1].annotation_no}`}></img>
                      </div>
                    </p>}

                  {!!props.index && props.annotations[props.index - 1].annotation_type !== 'video' &&
                    <span>
                      <p id="modalText">
                        <br></br>
                        <p dangerouslySetInnerHTML={{ __html: props.citations[props.index - 1][0].annotation }} className="m-auto text-center fade"></p>
                      </p>
                      <p id="modalCitation">
                        <br></br>
                        <p className="fade text-center w-[95%]"> Photo by: {props.citations[props.index - 1][0].author}, licensed under <a href='https://creativecommons.org/share-your-work/cclicenses/' target='_blank'>{props.citations[props.index - 1][0].license}</a></p>
                      </p>
                    </span>}

                  {!!props.index && props.annotations[props.index - 1].annotation_type == 'video' &&
                    <p id="modalVideo">
                      <iframe className="w-full h-[77.5vh] fade" src={props.annotations[props.index - 1].url}></iframe>
                    </p>}
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button className="bg-[#004C46] text-white" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
