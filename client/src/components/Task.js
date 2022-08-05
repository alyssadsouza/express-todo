import _ from 'lodash';
import { datesAreEqual } from '../utils';

const Task = ({task, date, user, setUser, deleteTask }) => {

  const setTaskComplete = () => {
    const newTasks = user.tasks.map(thisDaysTasks => {
      if (datesAreEqual(new Date(thisDaysTasks.date), date)) {
        const todaysTasks = thisDaysTasks.tasks.map(old => {
          if (old === task) {
            return {...old, "complete": !old.complete};
          }
          return old;
        });
        return {...thisDaysTasks, "tasks": todaysTasks};
      }
      return thisDaysTasks;
    });
    const newUser = _.cloneDeep(user);
    newUser.tasks = newTasks;
    setUser(newUser);
  };

  return (
      <div className="task">
          {task.complete ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="task-btn task-btn-complete" viewBox="0 0 20 20" fill="currentColor" onClick={() => setTaskComplete(task)}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="task-btn task-btn-incomplete" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} onClick={() => setTaskComplete(task)}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <p className="task-btn-task">{task.task}</p>
          <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteTask(task)} className="task-delete" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
      </div>
  );
}

export default Task;
