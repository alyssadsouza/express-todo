import { useState, useEffect } from 'react';
import _ from 'lodash';
import Calendar from 'react-calendar';
import Header from './components/Header';
import Task from './components/Task';
import { datesAreEqual } from './utils';
import { FaArrowRight, FaArrowCircleRight, FaArrowLeft, FaArrowCircleLeft} from 'react-icons/fa';
import './App.css';
import 'react-calendar/dist/Calendar.css';

function App() {

  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user && user !== undefined) {
      saveUser();
    }
  }, [user]);

  async function getUser() {
    const data = await fetch('/api/user/0');
    const userData = await data.json();
    console.debug('Fetched user: ', userData);
    setUser(_.cloneDeep(userData));
  }
  
  async function saveUser() {
    return fetch('/api/user/0', {
      method: 'PATCH',
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(user),
    }).then(res => {
      console.debug('Patch user success: ', res);
      return res;
    }).catch(err => {
      console.warn('Error submitting patch request for user: ', err);
      return err;
    });
  }

  async function addTask() {
    if (newTask) {
      return fetch('/api/user/0', {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
          date,
          "task": newTask
        }),
      }).then(res => {
        console.debug('Post user success: ', res);
        getUser();
        return res;
      }).catch(err => {
        console.warn('Error submitting post request for user: ', err);
        return err;
      });
    }
  }

  return (
    <div className="App">
      <Header />
      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className='to-do'>
          <div className='tasks'>
            <h1>On Your To-Do List</h1>
            <div className="task-list">
              {user.tasks.map(thisDaysTasks => {
                if (datesAreEqual(new Date(thisDaysTasks.date), date)) {
                  return thisDaysTasks.tasks.map((task, index) => (
                    <Task key={`task-${index}`} task={task} date={date} user={user} setUser={setUser}/>
                  ));
                }
                return '';
              })}
            </div>
            <div className='add-task'>
              <input type="text" value={newTask} onChange={event => setNewTask(event.target.value)} />
              <button type="submit" onClick={addTask}>Add</button>
            </div>
          </div>
          <div className='calendar-sidebar'>
            <Calendar
              onChange={setDate}
              value={date}
              nextLabel={<FaArrowRight/>}
              next2Label={<FaArrowCircleRight/>}
              prevLabel={<FaArrowLeft/>}
              prev2Label={<FaArrowCircleLeft/>}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
