require("dotenv").config();

const mongoose = require("mongoose");
// const validator = require ('validator')

const url = process.env.DB_URL;
mongoose.connect(url, {
  //  connecting to database
  useNewUrlParser: true,
  // useCreateIndex : true
});

// ------------  practice

// const user = mongoose.model('User', {
//     name : {
//         type : String,
//         required :true
//     },
//     age : {
//         type : Number,
//         default: 0,

//         validate(value)
//         {
//             if(value < 0)
//             {
//                 throw new Error('age must be a positive number')
//             }
//         }
//     },

// })

// const me  = new user({
//     name : 'Amit',
//     age : -1
// })

// me.save().then(()=>
// {
//     console.log(me)
// }).catch((error)=> {
//     console.log(error)
// })

// const User = mongoose.model('User', {
//     name :{
//         type :String,
//         required : true,
//         trim : true
//     },
//     email : {
//         type : String,
//         required : true,
//         trim : true,
//         lowercase :true,
//         validate(value){
//             if(!validator.isEmail(value)) {
//                 throw new Error('Email is invalid!')
//             }
//         }
//     },
//     age : {
//        type: Number,
//        default : 0,
//        validate(value){
//            if(value<0){
//                throw new Error('Age must be a positive number')
//            }

//        }
//     },
//     password : {
//         type : String,
//         trim : true,
//         required :true,
//         minlength : 7,
//         validate(value)
//         {
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('very weak password!')
//             }
//         }
//     }

// })

// const me  = new User({
//     name : 'prathvi',
//     email : '12cs0026@GMAIL.COM',
//     age :19,
//     password : 'password'

// })

// me.save().then(() =>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

// const Task = mongoose.model('Task',{
//     description : {
//        type : String,
//        required : true,
//        trim :true
//     },
//     completed :{
//      type : Boolean,
//      default :false
//     }
// })

// const task1 = new Task({
//     description : '     practice dsa problems!',
//     // completed : false
// })
