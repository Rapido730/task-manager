const express = require('express')
const Task = require('../model/task')
// const Note = require('../model/note')
const auth = require('../middleware/auth')
const { query } = require('express')
const router = new express.Router()


router.post('/tasks/create', auth,async (req, res) => {


    // const task = new Task(req.body)
    const task = await new Task({
        ...req.body,
        author : req.user._id
    })
     
    try{
        await task.save()
        res.status(201).send(task)    
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})

// GET /tasks?completed=true  it is filtering data
// GET /tasks?limit=10&skip=1  it is pagination which means data will be display as they are distributed in pages 
// skip =0 means first page and skip=1 means second page
// GET /tasks?sortBy=createdAt:desc or asc   // will sort tasks by created time and in descending order

router.get('/tasks/readAll', auth ,async (req,res) => {
   const match = {}
   const sort = {}
    // console.log(parseInt(req.query.limit))
   if(req.query.completed)
   {
        match.completed = req.query.completed === 'true'
   }

   if(req.query.sortBy)
   {
        const query = req.query.sortBy.split(':')
        sort[query[0]] = query[1] === 'desc' ? -1 : 1
   }

    try{
        await req.user.populate({
            path : 'tasks',
            match ,
            options : {
              limit : parseInt(req.query.limit),
              skip : parseInt(req.query.skip),
              sort 
            }
        })
        res.status(200).send(req.user.tasks)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})


router.get('/tasks/find/:description', auth, async (req,res) => {
    const description = req.params.description
    // console.log(req.params)
   try{
    //    const task = await Task.findById(_id)
        // console.log(req.user._id)
        const task = await Task.findOne({'description':description , 'author' : req.user._id})     
    if(!task)
       {
           return res.status(404).send('not found')
       }
       res.status(200).send(task)
   }
   catch(e)
   {
       res.status(500).send(e)
   }

})

router.patch('/tasks/update/:description', auth ,async (req,res) => {
    const description = req.params.description

    const updates = Object.keys(req.body)    // all attribute which are in http request
    const allowedUpdate = ['description','completed']          // attribute which are described in model 
    const validUpdates = updates.every((update) => allowedUpdate.includes(update))            // function to check valid updates 

    if(!validUpdates)
    {
        res.status(400).send({error : 'not valid update'})      // checking here
    }

    try{
        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new :true , runValidators :true})  // updating document 
        // console.log(req.user._id)  
        // new :true returns document after update and run validators 
        // provide validation check on data updated

        const task = await Task.findOne({'description':description , 'author' : req.user._id}) 
        
        
        if(!task)
        {
            return res.status(404).send('!not found')
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        
        await task.save()
        res.status(200).send(task)
    }
    catch(e)
    { 
        res.status(400).send(e)
    }

})

router.delete('/tasks/delete/:description', auth, async (req,res) => {
    const _description = req.params.description

    try{
        const task = await Task.findOneAndDelete({'description':_description,'author': req.user._id})
        if(!task)
        {
           return res.status(404).send('!not found')
        }
        
        res.status(200).send({task,operation : '!Task Deleted'})
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router