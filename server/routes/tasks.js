const Task = require('../models/task')
const express = require('express')
const router = express.Router()

// create a new task 
router.post('/', async (req, res) => {
    try {
        const task = await new Task(req.body).save()
        res.send(task)
    } catch (error) {
        res.send(error)
    }
})

// get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (error) {
        res.send(error)
    }
})

// get task by id
router.get('/:id', async (req, res) => {
    try {
        const tasks = await Task.find({ _id: req.params.id })
        res.send(tasks)
    } catch (error) {
        res.send(error)
    }
})


router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        )
        res.send(task)
    } catch (error) {
        res.send(error)
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const tasks = await Task.findByIdAndDelete(req.params.id);
        res.send(task)
        res.send(tasks)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router