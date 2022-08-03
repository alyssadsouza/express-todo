const Task = ({task, user, setUser}) => {

    const setTaskComplete = (task) => {
        const newTasks = user.tasks.map(oldTask => {
            if (oldTask.task === task.task) {
                return {...task, "complete": !oldTask.complete}
            }
            return oldTask;
        })
        setUser({
            ...user,
            "tasks": newTasks
        });
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
        </div>
    );
}

export default Task;
