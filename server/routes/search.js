async function routes (fastify, options) {

fastify.get('/:s', async (request, reply) => {
    const { s } = request.params;
    const decoded = atob(s);
    const wildcard = `%${decoded}%`;
    const [species] = await fastify.mysql.query(
        `
            SELECT *
            FROM species
            WHERE name LIKE ?
        `,
        [wildcard]
    );

    const [varieties] = await fastify.mysql.query(
        `
            SELECT *
            FROM varieties
            WHERE name LIKE ?
        `,
        [wildcard]
    );

    const [accessions] = await fastify.mysql.query(
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
});


}

export default routes;