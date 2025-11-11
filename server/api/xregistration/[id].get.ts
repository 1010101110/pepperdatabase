import db from "~/server/utils/db";
import { getUserFromRequest } from "~/server/utils/user";

export default defineEventHandler(async (event) => {
  //param
  const { id } = getRouterParams(event);
  const decode = decodeURIComponent(id).trim();
  if (!decode) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or missing ID",
    });
  }

  const ret: { r: any | null; x: any | null; a: any[] | null } = { r: null, x: null, a: null };

  //check auth
  const user = (await getUserFromRequest(event)) as any;

  //get registration
  const [rresults] = await db.execute(
    "SELECT * FROM xregistration WHERE ID = ? and email = ?",
    [decode, user?.email],
  );
  if ((rresults as any[]).length !== 1) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invalid registration",
    });
  }
  const r = (rresults as any[])[0];
  ret.r = r;

  if ((r as any).ID) {
    //get xchange info
    const [xresults] = await db.execute(
      "SELECT * FROM xchange WHERE exchange = ?",
      [(r as any).exchange],
    );
    if ((xresults as any[]).length !== 1) {
      throw createError({
        statusCode: 404,
        statusMessage: "Invalid xchange",
      });
    }
    const x = (xresults as any[])[0];
    ret.x = x;

    //get accession
    const [aresults] = await db.execute(
      "SELECT * FROM xaccession WHERE xregistration = ?",
      [(r as any).ID],
    );
    const a = (aresults as any[]).map((ta) => {
      try {
        ta.images = JSON.parse(ta.images);
      } catch (err) {
        //blank accessions do nothing
      }
      return ta;
    });
    ret.a = a;
  }

  return ret;
});
