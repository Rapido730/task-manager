const express = require('express')   // loading express
require('./db/mongoose')   // we dont require anything this is just to run mongoose file

const User = require('./model/user')
const Task = require('./model/task')

const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')
const { findById } = require('./model/user')

const app = express()              //   creating new app
const port = process.env.PORT   // creating a port

// app.use((req,res,next) => {
//     res.status(503).send('Server is under mentainence!')
// })



app.use(express.json())              // state that json will be used to transfer data
app.use(UserRouter)
app.use(TaskRouter)

const multer = require('multer')
// const upload = multer({
//     dest : 'images',
//     limit : {
//         fileSize : 1000000
//     },
//     fileFilter(req,file,cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('please upload word document'))
//         }
 
//         cb(undefined,true)
//     }
// })

// app.post('/upload', upload.single('file') ,(req,res) => {
//     res.send(200)
// })


app.listen(port, () => {        // instructing app that listen to port given
    console.log('Server is up on port ' + port)
})

// const bcrypt = require('bcryptjs')

// const Myfunction = async() => {
//     const password = 'Red@123'
//     const hashedPassword = await bcrypt.hash(password,8) 

//     console.log(password)
//     console.log(hashedPassword)

//     const match = await bcrypt.compare('Red@123',hashedPassword)
//     console.log(match)
// }

// Myfunction()

// const jwt = require('jsonwebtoken')
  
// const Myfunction = async () => {
//     const token = jwt.sign({ id : '1234'}, 'mynewlogin', {expiresIn : '7 days'})
//     console.log(token)

//     const data = jwt.verify(token,'mynewlogin')
//     console.log(data)

// }

// Myfunction()

// const main = async () => {
//     // console.log('hello')
//     // const task = await Task.findById('62a48a3488c49175a428cbca')
   
//     // await task.populate('author')
//     // console.log(task.author)

//     const user = await User.findById('62a48a1888c49175a428cbc4')
//     await user.populate('tasks')
//     console.log(user.tasks) 
// }

// main() 