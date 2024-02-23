"use client"
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';
import Sketchfab from '@sketchfab/viewer-api';

export const boolRinse = (bool: boolean) => {
  var rinsed = bool ? "Yes" : "No";
  return rinsed;
}

export const addCommas = (stringArray: Array<string>) => {
  if (stringArray) {
    const commaSeparated = stringArray.map((str) => str + ', ');
    commaSeparated[commaSeparated.length - 1] = commaSeparated[commaSeparated.length - 1].replace(',', '');
    return commaSeparated;
  }
}

export const arrayFromObjects = (objectArray: Array<any>) => {
  var softwareArray: string[] = [];
  for (let obj of objectArray) {
    softwareArray.push(obj.software);
  }
  return addCommas(softwareArray);
}

export const getAnnotator = (photoAnnotations: any) => {
  for (let annotation of photoAnnotations) {
    if (annotation[0]) {
      const annotator = annotation[0].annotator;
      return annotator;
    }
  }
}

export function setViewerWidth(modelViewer: any, annotationDiv: any, annotationsChecked: any) {
  if (annotationsChecked) {
    annotationDiv.style.setProperty("width", "40%");
    modelViewer.style.setProperty("width", "60%");
  }
  else {
    annotationDiv.style.setProperty("width", "0");
    modelViewer.style.setProperty("width", "100%");
    document.getElementById("model-viewer")?.click();
  }
}

export function annotationControl(api: any, annotations: any, annotationsChecked: any) {
  if (annotationsChecked) {
    for (let i = 0; i < annotations.length; i++) {
      api.showAnnotation(i, function (err: any, index: number) { })
    }
    api.showAnnotationTooltips(function (err: any) {
      if (!err) { }
    });
  }
  else {
    for (let i = 0; i < annotations.length; i++) {
      api.hideAnnotation(i, function (err: any, index: number) { })
    }
    api.hideAnnotationTooltips(function (err: any) { });
  }
}