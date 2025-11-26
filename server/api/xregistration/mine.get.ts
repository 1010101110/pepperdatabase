import db from "~/server/utils/db";
import { getUserFromRequest } from "~/server/utils/user";

export default defineEventHandler(async (event) => {
  const user = (await getUserFromRequest(event)) as any;
  if (user?.email) {
    const [results] = await db.execute(
      "SELECT ID, exchange, user, region FROM xregistration where email = ? order by exchange desc",
      [user.email],
    );
    return results;
  }
  return;
});
