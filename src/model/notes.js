const mongoose  =  require ('mongoose')
const validator = require('validator')

const noteSchema = new mongoose.Schema({
    description : {
       type : String,
       unique :true,
       required : true,
       trim :true    
    },
    author : {
        type : mongoose.Schema.Types.ObjectId ,
        required :true,
        ref : 'User'
    } 
}, {
    timestamps : true 
})

const Note = mongoose.model('Note',noteSchema)

module.exports = Note