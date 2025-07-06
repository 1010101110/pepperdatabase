import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  if (query.s) {
    const s = query.s.toString();
    const decoded = atob(s);
    const wildcard = `%${decoded}%`;
    const [species] = await db.query(
      `
            SELECT *
            FROM species
            WHERE name LIKE ?
        `,
      [wildcard],
    );

    const [varieties] = await db.query(
      `
            SELECT *
            FROM varieties
            WHERE name LIKE ?
        `,
      [wildcard],
    );

    const [accessions] = await db.query(
      `
        SELECT a.*, r.user, r.region
        FROM xaccession a
        JOIN xregistration r ON a.xregistration = r.ID
        WHERE
        a.variety LIKE ? or a.ID LIKE ?
        and r.sent is not NULL
        `,
      [wildcard, wildcard],
    );

    return {
      species: species,
      varieties: varieties,
      accessions: accessions,
    };
  }
});
