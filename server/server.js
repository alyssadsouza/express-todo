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
  try {
    const { rows } = await database.query(
      `
      SELECT * FROM task
      WHERE user_id = ${req.params.uuid}
      AND date = now()::date
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
  try {
    const { rows } = await database.query(
      `
      INSERT INTO task (user_id, task, complete, date)
      VALUES (${req.params.user_id}, '${req.body.task}', false, now()::date)
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

// app.patch("/api/user/:id", (req, res, next) => {
//   try {
//     const updatedUser = req.body;
//     users[req.params.id] = updatedUser;
//     res.status(200).send("Patch request successful!");
//   } catch (e) {
//     res
//       .status(409)
//       .send(`Error: could not complete user update patch request --> ${e}`);
//   }
//   next();
// });

// app.post("/api/user/:id", (req, res, next) => {
//   try {
//     const newTask = req.body.task;
//     const date = req.body.date;
//     const updatedUser = users[req.params.id];
//     let dateExists = false;
//     updatedUser.tasks.forEach((task) => {
//       if (datesAreEqual(new Date(task.date), new Date(date))) {
//         dateExists = true;
//         task.tasks.push({ task: newTask, complete: false });
//       }
//     });
//     if (!dateExists) {
//       updatedUser.tasks.push({
//         date,
//         tasks: [{ task: newTask, complete: false }],
//       });
//     }
//     users[req.params.id] = updatedUser;
//     res.status(200).send("Post request successful!");
//   } catch (e) {
//     res
//       .status(409)
//       .send(`Error: could not complete user update post request --> ${e}`);
//   }
//   next();
// });

// app.delete("/api/user/:id", (req, res, next) => {
//   try {
//     const task = req.body.task;
//     const date = req.body.date;
//     const updatedUser = JSON.parse(JSON.stringify(users[req.params.id]));
//     users[req.params.id].tasks.forEach((day, index) => {
//       if (datesAreEqual(new Date(day.date), new Date(date))) {
//         updatedUser.tasks[index].tasks = day.tasks.filter(
//           (oldTask) => oldTask.task !== task.task
//         );
//       }
//     });
//     users[req.params.id] = updatedUser;
//     res.status(200).send("Delete request successful!");
//   } catch (e) {
//     res
//       .status(409)
//       .send(`Error: could not complete user update delete request --> ${e}`);
//   }
//   next();
// });

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}/`)
);
