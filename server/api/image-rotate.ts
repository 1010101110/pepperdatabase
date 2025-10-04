import { rotateImage } from "~/server/utils/image";

export default defineEventHandler(async (event) => {
  //auth
  const user = (await getUserFromRequest(event)) as any;

  //param
  const body = await readBody(event);
  if (body.rotateMe) {
    try {
      await rotateImage(body.rotateMe);
      addHistory(body.rotateMe,`rotated image`, user.id)

      return { success: true };
    } catch (e) {
      console.log(e);
    }
  }

  console.log("failed rotate-image");
  console.log(event);
  return { success: false };
});
