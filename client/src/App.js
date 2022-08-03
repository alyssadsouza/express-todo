import { useState, useEffect } from 'react';
import _ from 'lodash';
import Header from './components/Header';
import Task from './components/Task';
import './App.css';

function App() {

  const [user, setUser] = useState(null);

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
    console.debug('Fetched user: ', userData.user);
    setUser(_.cloneDeep(userData.user));
  }
  
  async function saveUser() {
    return fetch('/api/user/0', {
      method: 'PATCH',
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({"user": user}),
    }).then(res => {
      console.debug('Patch user success: ', res);
      return res;
    }).catch(err => {
      console.warn('Error submitting Patch request for user: ', err);
      return err;
    });
  }

  return (
    <div className="App">
      <Header />
      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className='tasks'>
          <h1>On Your To-Do List</h1>
          <div className="task-list">
            {user.tasks.map((task, index) => (
              <Task key={`task-${index}`} task={task} user={user} setUser={setUser}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
