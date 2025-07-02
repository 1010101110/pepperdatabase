import formidable from "formidable";
import { handleImageUpload } from "~/server/utils/image";

export default defineEventHandler(async (event) => {
  //auth
  const user = (await getUserFromRequest(event)) as any;

  // process / save image to disk
  const result = await handleImageUpload(event, {
    folder: "accession",
  });

  if (result.success) {
    //update accession
    if (result.fields && result.fields.accession) {
      const aID = Array.isArray(result.fields.accession)
        ? result.fields.accession[0]
        : result.fields.accession;
      const [aresp] = await db.execute(
        "SELECT * FROM xaccession where ID = ?",
        [aID],
      );
      const row = (aresp as any)[0];
      if (row) {
        try {
          // Attempt to parse the images field
          row.images = row.images ? JSON.parse(row.images) : [];
          // update accession
          row.images.push(result.url);
          await db.execute("UPDATE xaccession SET images = ? where ID = ?", [
            JSON.stringify(row.images),
            aID,
          ]);
        } catch (err) {
          console.error(`Error parsing images:`, err);
          throw createError("bad update");
        }
      } else {
        throw createError("bad accession");
      }
    } else {
      throw createError("bad accession");
    }
  }

  return result;
});
