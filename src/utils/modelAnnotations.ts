import { getAnnotations, getCitations } from "@/api/queries";

export async function citationHandler(annotations: any) {
  var citations: any = [];
  for (let i = 0; i < annotations.length; i++) {
    if (annotations[i].annotation_type == "photo" || annotations[i].annotation_type == "model") {
      const citation = await getCitations(annotations[i].url)
      citations.push(citation);
    }
    else {
      citations.push("");
    }
  }
  return citations;
};

export async function annotationHandler(hasModel: boolean, _3dmodel: any) {
  if (hasModel) {
    const annotations = await getAnnotations(_3dmodel[0].uid);
    return annotations;
  }
};