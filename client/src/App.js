import { useState, useEffect } from "react";
import _ from "lodash";
import Calendar from "react-calendar";
import Header from "./components/Header";
import Task from "./components/Task";
import {
  FaArrowRight,
  FaArrowCircleRight,
  FaArrowLeft,
  FaArrowCircleLeft,
} from "react-icons/fa";
import "./App.css";
import "react-calendar/dist/Calendar.css";

const userID = 1;

function App() {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [user, setUser] = useState({});
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getTasks();
  }, [date]);

  async function getUser() {
    try {
      const data = await fetch(`/api/users/${userID}`);
      const userData = await data.json();
      setUser(userData);
    } catch (err) {
      console.debug("Error fetching user:", err);
    }
  }

  async function getTasks() {
    try {
      const data = await fetch(`/api/tasks/1/${date}`);
      const taskData = await data.json();

      if (!Array.isArray(taskData)) {
        console.debug("Error querying database");
        return;
      }

      console.debug("Fetched tasks: ", taskData);
      setTasks(_.cloneDeep(taskData));
    } catch (err) {
      console.debug("Error fetching tasks:", err);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (newTask) {
      return fetch(`/api/tasks/${user.id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          date,
          task: newTask,
        }),
      })
        .then((res) => {
          console.debug("Post user success: ", res);
          getTasks();
          setNewTask("");
          return res;
        })
        .catch((err) => {
          console.warn("Error submitting post request for user: ", err);
          return err;
        });
    }
  }

  async function toggleTask(task) {
    return fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        task,
        status: !task.complete,
      }),
    })
      .then((res) => {
        console.debug("Patch user success: ", res);
        getTasks();
        return res;
      })
      .catch((err) => {
        console.warn("Error submitting patch request for user: ", err);
        return err;
      });
  }

  async function deleteTask(task) {
    return fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ task }),
    })
      .then((res) => {
        console.debug("Delete task success: ", res);
        getTasks();
        return res;
      })
      .catch((err) => {
        console.warn("Error submitting post request for user: ", err);
        return err;
      });
  }

  return (
    <div className="App">
      <Header />
      {!tasks ? (
        <p>Loading...</p>
      ) : (
        <div className="to-do">
          <div className="tasks">
            <h1>On Your To-Do List</h1>
            <div className="task-list">
              {tasks.length === 0 && (
                <div className="empty-tasks">
                  <h4>You don't have any tasks for this day yet.</h4>
                </div>
              )}
              {tasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  deleteTask={deleteTask}
                  toggleTask={toggleTask}
                />
              ))}
            </div>
            <div className="add-task">
              <form className="add-task-form" onSubmit={addTask}>
                <input
                  type="text"
                  className="add-task-input"
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                />
                <button type="submit" className="add-task-btn">
                  Add
                </button>
              </form>
            </div>
          </div>
          <div className="calendar-sidebar">
            <Calendar
              onChange={setDate}
              value={date}
              nextLabel={<FaArrowRight />}
              next2Label={<FaArrowCircleRight />}
              prevLabel={<FaArrowLeft />}
              prev2Label={<FaArrowCircleLeft />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
