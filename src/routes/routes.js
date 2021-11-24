const express = require('express');
const router  = express.Router();
const Task    = require('../models/task');

//Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

//Get one task by id
router.get('/:id', async(req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
})

//Create a new Task 
router.post('/',async (req, res) => {
    const { title, type, description } = req.body;
    const task = new Task({title , type, description});
    await task.save();
    res.json({status : "task saved"});
});

//Update one task using his id
router.put('/:id', async (req, res) => {
  const { title, type, description } = req.body;
  const newTask = {title, type, description};
  await Task.findByIdAndUpdate(req.params.id, newTask);
  res.json({status : "task updated"});
})

//Delete one task using his id
router.delete('/:id', async (req, res) =>{
  await Task.findByIdAndRemove(req.params.id);
  res.json({status : "task removed"});
})



module.exports = router;