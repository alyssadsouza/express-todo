const express = require('express')
const app = express()

app.use(express.json());

const users = [
    {
        "uuid": 0,
        "tasks": [
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
        res.status(409).send(`Error: could not complete user update Patch request --> ${e}`)
    }
    next()
})

app.listen(5050, () => console.log('Server started on localhost:5050'))
