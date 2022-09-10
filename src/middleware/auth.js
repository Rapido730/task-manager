const jwt = require('jsonwebtoken')
const User = require('../model/user')



const auth = async (req,res,next)=> {
    try{
        // console.log(req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decode._id)

        const user  = await User.findOne({_id : decode._id,'tokens.token' : token})
        
        // console.log(user)
        if(!user){
            throw new Error()
        }
        
        req.user = user
        req.token = token
        next()
    } catch(e) {
        res.status(401).send({error : 'please Authenticate!'})
    }    


}

module.exports = auth