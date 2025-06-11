async function routes (fastify, options) {

fastify.get('/search/:s', async (request, reply) => {
    const { s } = request.params;
    const connection = await fastify.mysql.getConnection();
    const [species] = await connection.query(
        `
            SELECT *
            FROM species
            WHERE name LIKE '%?%'
        `,
        [s]
    );

    const [varieties] = await connection.query(
        `
            SELECT *
            FROM varieties
            WHERE name LIKE '%?%'
        `,
        [s]
    );

    const [accessions] = await connection.query(
        `
            SELECT *
            FROM xaccession
            WHERE variety LIKE '%?% or ID = ?'
        `,
        [s,s]
    );

    connection.release();
    return {
        species:species,
        varieties:varieties,
        accessions:accessions
    }
});


}

export default routes;