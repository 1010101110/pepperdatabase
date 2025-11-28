import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { region, exchange } = query;

  if (!region || !exchange) {
    return [];
  }

  const [results] = await db.execute(
    `
    SELECT DISTINCT r.user
    FROM xregistration r
    JOIN xaccession a ON r.ID = a.xregistration
    WHERE r.region = ? AND r.exchange = ? AND a.images IS NOT NULL
    ORDER BY r.user ASC
    `,
    [region, exchange]
  );

  return (results as any[]).map(row => row.user);
});
