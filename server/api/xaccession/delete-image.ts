import { deleteImage } from "~/server/utils/image";

export default defineEventHandler(async (event) => {
  //auth
  const user = (await getUserFromRequest(event)) as any;

  //param
  const body = await readBody(event);
  if (body.deleteMe && body.updateMe) {
    try {
      const imgs = (body.updateMe.images as Array<string>).filter(
        (x) => x !== body.deleteMe,
      );

      await db.execute("UPDATE xaccession SET images = ? where ID = ?", [
        JSON.stringify(imgs),
        body.updateMe.ID,
      ]);

      await deleteImage(body.deleteMe);

      return { success: true };
    } catch (e) {
      console.log(e);
    }
  }

  console.log("failed delete-image");
  console.log(event);
  return { success: false };
});
