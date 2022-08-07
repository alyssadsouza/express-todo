const express = require("express");
const app = express();
const PORT = 5050;

const database = require("./database");

app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                                    Users                                   */
/* -------------------------------------------------------------------------- */

app.get("/api/users/:uuid", async (req, res) => {
  try {
    const { rows } = await database.query(
      `
      SELECT * FROM users
      WHERE id = ${req.params.uuid}
      `
    );
    console.debug("Rows queried:", rows);
    return res.status(200).send(rows[0]);
  } catch (error) {
    console.debug("Query error:", error);
    return res.status(401).send(error);
  }
});

/* -------------------------------------------------------------------------- */
/*                                    Tasks                                   */
/* -------------------------------------------------------------------------- */

app.get("/api/tasks/:uuid/:date", async (req, res) => {
  const date = (new Date(req.params.date)).toISOString();
  try {
    const { rows } = await database.query(
      `
      SELECT * FROM task
      WHERE user_id = ${req.params.uuid}
      AND date = '${date}'
      ORDER BY id
      `
    );
    console.debug("Rows queried:", rows);
    return res.status(200).send(rows);
  } catch (error) {
    console.debug("Query error:", error);
    return res.status(401).send(error);
  }
});

app.post("/api/tasks/:user_id", async (req, res) => {
  const date = (new Date(req.body.date)).toISOString();
  try {
    const { rows } = await database.query(
      `
      INSERT INTO task (user_id, task, complete, date)
      VALUES (${req.params.user_id}, '${req.body.task}', false, '${date}')
      `
    );
    console.debug("Rows queried:", rows);
    return res.status(200).send(rows);
  } catch (error) {
    console.debug("Query error:", error);
    return res.status(401).send(error);
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const { rows } = await database.query(
      `
      UPDATE task
      SET complete = ${req.body.status}
      WHERE id = ${req.params.id};
      `
    );
    return res.status(200).send(rows);
  } catch (error) {
    console.debug("Patch error:", error);
    return res.status(401).send(error);
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { rows } = await database.query(
      `
      DELETE FROM task
      WHERE id = ${req.params.id}
      `
    );
    return res.status(200).send(rows);
  } catch (error) {
    console.debug("Delete error:", error);
    return res.status(401).send(error);
  }
});

/* -------------------------------------------------------------------------- */

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}/`)
);
