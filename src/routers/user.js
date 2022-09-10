
const express = require('express')
const User = require('../model/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendMail,byeMail} = require('../emails/account')
// const byeMail = require('../emails/account/byeMail')
const upload = multer({
    // dest:'avatars',      // destination to save files     // commented because now e save image a s binary in user document
    limits : {
        fileSize : 1000000
    }, 
    fileFilter (req,file,cb)
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)/))
        {
            return cb(new Error('Upload a image file'))
        }

        cb (undefined,true)
    }                
})

const router = new express.Router()

router.post('/users',async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()   // generating token for new user who signup just now
        sendMail(user.email,user.name)
        res.status(201).send({user, token})
    } 
    catch(e){
        res.status(400).send(e)
    }

    
})

router.post('/users/login', async(req,res) => { 

    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)

        const token = await user.generateAuthToken()    //  generating token when a person signed in
        res.status(200).send({user  , token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth , async (req,res) => {

    try{
        // console.log(req.user.tokens)
        // console.log(req.token)
        // console.log('now')
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token 
        }) 
        
        // console.log(req.user.tokens)
        
        await req.user.save()

        res.send('logged out!')
    } catch(e) {
        res.status(500).send(e)
    }

})

router.post('/users/logoutAll', auth ,async (req,res) => {

    try{
        req.user.tokens = []
        await req.user.save()
        res.send('logged out of all sessions!')
    } catch(e) {
        res.status(500).send(e)
    }

})

router.get('/users/me', auth ,async (req,res) => {  // auth is middleware which authenticate user 
    
    res.send(req.user)
})


router.patch('/users/update', auth,async (req,res) => {
    // console.log(req.body)
    const allowedUpdate = ['name','age','email','password']
    const updates = Object.keys(req.body)
    
    const validUpdates = updates.every((update) => allowedUpdate.includes(update) )
    
    if(!validUpdates)
    {
        return res.status(400).send({error : '!invalid updates'})
    }

    try{
        // const task = await User.findByIdAndUpdate(req.params.id, req.body, {new :true , runValidators:true })
        const user  = req.user    // using data froma auth function

        updates.forEach((update) => {user[update] = req.body[update]})

        await user.save()

        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/delete', auth , async (req,res) => {
   try{
       byeMail(req.user.email,req.user.name)
       await req.user.delete()
       res.status(200).send(req.user)

   } catch(e) {
     res.status(500).send(e)
   }

})

router.post('/users/me/avatar', auth ,upload.single('avatar') ,async (req,res) => {
    const buffer  = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error,req,res,next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth , async (req,res) => {
    if( req.user.avatar===undefined){
        res.status(400).send({error : 'Avatar not found!'})
    }
    else{

        req.user.avatar = undefined
        await req.user.save()
        res.send()
    }     
})

router.get('/users/me/avatar', auth,async(req,res) => {

    try{
        

        if(!req.user.avatar)
        {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')                // to send a image file stored as binary file as a image file
        res.send(req.user.avatar)

    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router