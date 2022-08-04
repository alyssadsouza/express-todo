const express = require('express')
const app = express()

app.use(express.json());

const users = [
    {
        "uuid": 0,
        "tasks": [
            {
                date: new Date(),
                tasks: [
                    {
                        "task": "Walk the dog",
                        "complete": true
                    },
                    {
                        "task": "Fold laundry",
                        "complete": false
                    },
                    {
                        "task": "Wash dishes",
                        "complete": false
                    }
                ]
            }
        ]
    }
]

const datesAreEqual = (first, second) => {
    if (!first || !second || !(first instanceof Date) || !(second instanceof Date)) return false;
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
};

app.get('/api/user/:id', (req, res, next) => {
    res.json(users[req.params.id])
    next()
})

app.patch('/api/user/:id', (req, res, next) => {
    try {
        const updatedUser = req.body
        users[req.params.id] = updatedUser
        res.status(200).send('Patch request successful!')
    } catch (e) {
        res.status(409).send(`Error: could not complete user update patch request --> ${e}`)
    }
    next()
})

app.post('/api/user/:id', (req, res, next) => {
    try {
        const newTask = req.body.task
        const date = req.body.date
        const updatedUser = users[req.params.id]
        let dateExists = false;
        updatedUser.tasks.forEach(task => {
            if (datesAreEqual(new Date(task.date), new Date(date))) {
                dateExists = true
                task.tasks.push({"task": newTask, "complete": false})
            }
        })
        if (!dateExists) {
            updatedUser.tasks.push({date, tasks: [{"task": newTask, "complete": false}]})
        }
        users[req.params.id] = updatedUser
        res.status(200)
    } catch (e) {
        res.status(409).send(`Error: could not complete user update post request --> ${e}`)
    }
    next()
})

app.listen(5050, () => console.log('Server started on localhost:5050'))
