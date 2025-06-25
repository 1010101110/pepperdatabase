import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  if(query.s){
    const s = query.s.toString();
    const decoded = atob(s);
    const wildcard = `%${decoded}%`;
    const [species] = await db.query(
        `
            SELECT *
            FROM species
            WHERE name LIKE ?
        `,
        [wildcard]
    );

    const [varieties] = await db.query(
        `
            SELECT *
            FROM varieties
            WHERE name LIKE ?
        `,
        [wildcard]
    );

    const [accessions] = await db.query(
        `
            SELECT *
            FROM xaccession
            WHERE variety LIKE ? or ID = ?
        `,
        [wildcard,decoded]
    );

    return {
        species:species,
        varieties:varieties,
        accessions:accessions
    }
  }

})