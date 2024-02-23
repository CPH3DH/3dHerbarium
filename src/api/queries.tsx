/**
 * @file /api/queries.tsx
 * @fileoverview database queries used throughout the application
 */

import { PrismaClient } from "@prisma/client";
import { SiteReadyModels } from "./types";

const prisma = new PrismaClient();

/**
 * @function getModelUid
 * @description returns a list of models matching the species parameter
 * 
 * @param {string} species of the model
 */
export async function getModel(species: string) {
  const models = await prisma.model.findMany({
    where: { spec_name: species, site_ready: true, base_model: true }
  });

  return models;
};


/**
 * @function getAnnotations
 * @description returns a list of annotations matching the uid parameter in order of annotation number
 * 
 * @param {string} uid of the annotated model
 */
export async function getAnnotations(uid: string) {
  const annotations = await prisma.annotations.findMany({
    where: { uid: uid },
    orderBy: { annotation_no: 'asc' }
  });

  return annotations;
};


/**
* @function getCitations
* @description returns a list of photo annotations (and corresponding citation info) matching the url parameter
* 
* @param {string} uid of the annotated model
*/
export async function getCitations(url: string) {
  const citation = await prisma.photo_annotation.findMany({
    where: { url: url }
  });

  return citation;
};


/**
* @function getSoftwares
* @description returns a list of all softwares used for the uid parameter
* 
* @param {string} uid of the model
*/
export async function getSoftwares(uid: string) {
  const softwares = await prisma.software.findMany({
    where: { uid: uid }
  });

  return softwares;
};


/**
* @function getImageSet
* @description returns image set data for photogrammetry models
* 
* @param {string} uid of the model
*/
export async function getImageSet(uid: string) {
  const imageSet = await prisma.image_set.findMany({
    where: { uid: uid }
  });

  return imageSet;
};


/**
 * @function getAllSiteReadyModels
 * @description returns a list of all models labeled as site_ready from the database.
 * 
 * @returns {Promise<SiteReadyModels[]>}
 */
export const getAllSiteReadyModels = async (): Promise<SiteReadyModels[]> => {
  const models = await prisma.model.findMany({
    where: { site_ready: true, base_model: true },
    orderBy: {
      spec_name: 'asc'
    }
  });
  let tempModels: SiteReadyModels[] = models.map(model => ({
    ...model,
    annotations: []
  }));

  for (let model of tempModels) {
    const annotations = await prisma.annotations.findMany({
      where: { uid: model.uid, annotation_type: 'photo' },
      include: { photo_annotation: true },
    });
    model.annotations = annotations;
  }

  return tempModels;
};