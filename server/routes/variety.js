async function routes (fastify, options) {
  //auth handler
  const auth = buildAuth(fastify);

  // 📌 Get all varieties
  fastify.get('/varieties', async (request, reply) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM varieties');
    connection.release();
    return rows;
  });

  // 📌 Get a single variety by ID
  fastify.get('/varieties/:id', async (request, reply) => {
    const { id } = request.params;
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM varieties WHERE ID = ?', [id]);
    connection.release();
    return rows.length ? rows[0] : reply.status(404).send({ error: 'Variety not found' });
  });

  // 📌 Create a new variety
  fastify.post('/varieties', { preHandler: auth }, async (request, reply) => {
    const { name, species, heat, podsize, podcolor, plantcolor, maturity, origin, accession, description } = request.body;

    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `INSERT INTO varieties (name, species, heat, podsize, podcolor, plantcolor, maturity, origin, accession, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, species, heat, podsize, podcolor, plantcolor, maturity, origin, accession, description]
    );
    connection.release();

    return reply.status(201).send({ message: 'Variety created', id: result.insertId });
  });

  // 📌 Update an existing variety
  fastify.put('/varieties/:id', { preHandler: auth }, async (request, reply) => {
    const { id } = request.params;
    const { name, species, heat, podsize, podcolor, plantcolor, maturity, origin, accession, description } = request.body;

    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `UPDATE varieties
       SET name=?, species=?, heat=?, podsize=?, podcolor=?, plantcolor=?, maturity=?, origin=?, accession=?, description=?
       WHERE ID=?`,
      [name, species, heat, podsize, podcolor, plantcolor, maturity, origin, accession, description, id]
    );
    connection.release();

    return result.affectedRows ? { message: 'Variety updated' } : reply.status(404).send({ error: 'Variety not found' });
  });

}

export default routes;