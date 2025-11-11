import { ar } from "vuetify/locale";
import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = (await getUserFromRequest(event)) as any;
  if(user.account_type !== 3){
    throw createError({ statusCode: 403, statusMessage: "Invalid user" });
  }


  const { region, exchange } = body || {};

  //get the registrations
  const [xresults] = await db.execute(
    `
      SELECT r.*
      FROM xregistration r
      WHERE r.region = ? and r.exchange = ?
    `,
    [region, exchange],
  );
  const r = xresults as any[];

  //get the accessions
  for (let i = 0; i < r.length; i++) {
    const xreg = r[i];

    const [aresults] = await db.execute(
      `
        SELECT a.*
        FROM xaccession a
        JOIN xregistration r ON a.xregistration = r.ID
        WHERE r.ID = ?
      `,
      [xreg.ID],
    );

    const a = (aresults as any[]).map((j) => {
      try {
        j.images = JSON.parse(j.images);
      } catch (err) {
        //blank accessions do nothing
      }
      return j;
    });

    xreg.accessions = a;
  }

  return r;
});
