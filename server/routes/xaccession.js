async function routes (fastify, options) {
  //auth handler
  const auth = buildAuth(fastify);

  // 📌 Get all xaccessions
  fastify.get('/xaccession', async (request, reply) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM xaccession');
    connection.release();
    return rows;
  });

  // 📌 Get a single xaccession by ID
  fastify.get('/xaccession/:id', async (request, reply) => {
    const { id } = request.params;
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM xaccession WHERE ID = ?', [id]);
    connection.release();
    return rows.length ? rows[0] : reply.status(404).send({ error: 'xaccession not found' });
  });

  // 📌 Create a new xaccession
  fastify.post('/xaccession', async (request, reply) => {
    const { xregistration, variety, generation, pollination, quantity, description, images } = request.body;

    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `INSERT INTO xaccession (xregistration, variety, generation, pollination, quantity, description, images)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [xregistration, variety, generation, pollination, quantity, description, images]
    );
    connection.release();

    return reply.status(201).send({ message: 'xaccession created', id: result.insertId });
  });

  // 📌 Update an existing xaccession
  fastify.put('/xaccession/:id', async (request, reply) => {
    const { id } = request.params;
    const { xregistration, variety, generation, pollination, quantity, description, images } = request.body;

    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `UPDATE xaccession
       SET xregistration=?, variety=?, generation=?, pollination=?, quantity=?, description=?, images=?, edit_on=NOW()
       WHERE ID=?`,
      [xregistration, variety, generation, pollination, quantity, description, images, id]
    );
    connection.release();

    return result.affectedRows ? { message: 'xaccession updated' } : reply.status(404).send({ error: 'xaccession not found' });
  });

}

  export default routes;