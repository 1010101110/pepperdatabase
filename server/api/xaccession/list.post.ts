import { ar } from "vuetify/locale";
import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { region, exchange } = body || {};

  const [aresults] = await db.execute(
    `
        SELECT a.*, r.user, r.region
        FROM xaccession a
        JOIN xregistration r ON a.xregistration = r.ID
        WHERE r.region = ? and r.exchange = ? and a.images is not null
        `,
    [region, exchange],
  );

  const a = (aresults as any[]).map((r) => {
    try {
      r.images = JSON.parse(r.images);
    } catch (err) {
      //blank accessions do nothing
    }
    return r;
  });

  return a;
});
