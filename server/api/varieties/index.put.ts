import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // auth
  const user = (await getUserFromRequest(event)) as any;

  const {
    ID,
    name,
    species,
    heat,
    podsize,
    podcolor,
    plantcolor,
    maturity,
    origin,
    accession,
    description,
  } = body || {};

  if (!ID) {
    throw createError({ statusCode: 400, message: "Missing variety ID" });
  }

  const codedDescription = description ? btoa(description) : null;

  const [result] = await db.execute(
    `UPDATE varieties SET
      name = ?,
      species = ?,
      heat = ?,
      podsize = ?,
      podcolor = ?,
      plantcolor = ?,
      maturity = ?,
      origin = ?,
      accession = ?,
      description = ?
    WHERE ID = ?`,
    [
      name,
      species,
      heat,
      podsize,
      podcolor,
      plantcolor,
      maturity,
      origin,
      accession,
      codedDescription,
      ID,
    ],
  );

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  };
});
