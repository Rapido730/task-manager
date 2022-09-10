const mongoose  =  require ('mongoose')
const validator = require('validator')

const bcrypt = require('bcryptjs')   //  module used to encrypt and varify user password
const jwt = require('jsonwebtoken')   //  to generate user authentication password
const Task = require('./task')

const UserSchema = new mongoose.Schema({
    name :{
        type :String,
        required : true,
        trim : true 
    },
    email : {
        type : String,
        unique :true ,
        required : true,
        trim : true,
        lowercase :true, 
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },    
    age : {
       type: Number,
       default : 0,
       validate(value){
           if(value<0){
               throw new Error('Age must be a positive number')
           }

       }
    },
    password : {
        type : String,
        trim : true,
        required :true,
        minlength : 7,
        validate(value)
        {
            if(value.toLowerCase().includes('password')){
                throw new Error('very weak password!')
            }
        }
    },
    tokens : [{     //  field which is a rray of token stores all token generate for the user 
        token : {
            type :String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
}    ,{
        timestamps : true
})

UserSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'author'
})

// model.methods.function is used to define a function to be used by an instance of model such as user.function

UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token =  jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})        // adding token to tokens field
    await user.save()                                   // again saving user
    // console.log(user._id)
    // console.log(token)
    return token
}

// model.statics.function is used to define a function to be used by Model it self such as here by User.function
UserSchema.statics.findByCredentials = async (email,password) => {     // in order to varify user email id and paasword
    const user = await User.findOne({email})
    
    if(!user)
    {
        throw new Error('!unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)  // if given  password doesn't match with password stored

    if(!isMatch)
    {
        throw new Error('!unable to login')
    }

    return user
}

// to hash password
UserSchema.pre('save', async function(next) {
    const user = this
    
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8)   // encrypting password when it is created or modified 
    }

    next()
})

UserSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({'author' : user._id})
    next()
})

const User = mongoose.model('User',UserSchema )

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

module.exports = User