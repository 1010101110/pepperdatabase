import { ar } from "vuetify/locale";
import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const [aresults] = await db.execute(
    `
      SELECT a.ID as value, concat(a.ID, ' ', a.variety) as title
      FROM xaccession a
      JOIN xregistration r ON a.xregistration = r.ID
      WHERE r.sent is not NULL
    `,
  );

  return aresults;
});
