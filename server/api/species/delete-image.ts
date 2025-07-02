import { deleteImage } from "~/server/utils/image";

export default defineEventHandler(async (event) => {
  //auth
  const user = (await getUserFromRequest(event)) as any;

  //param
  const body = await readBody(event);
  if (body.id) {
    try {
      await deleteImage(`/images/species/${body.id}.webp`);

      return { success: true };
    } catch (e) {
      console.log(e);
    }
  }

  console.log("failed delete-image");
  console.log(event);
  return { success: false };
});
