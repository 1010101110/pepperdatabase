import formidable from "formidable";
import { handleImageUpload } from "~/server/utils/image";

export default defineEventHandler(async (event) => {
  //auth
  const user = (await getUserFromRequest(event)) as any;

  // process / save image to disk
  const result = await handleImageUpload(event, {
    folder: "variety",
  });

  return result;
});
