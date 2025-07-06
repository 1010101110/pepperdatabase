import formidable from "formidable";
import { handleImageUpload } from "~/server/utils/image";

export default defineEventHandler(async (event) => {
  //auth
  const user = (await getUserFromRequest(event)) as any;

  // process / save image to disk
  const result = await handleImageUpload(event, {
    folder: "variety",
  });

  if(result.success){
    addHistory(result.url || '',`uploaded image`, user.id)
  }

  return result;
});
