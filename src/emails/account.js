const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY,
);
 
// const request = mailjet
//         .post("send", {'version': 'v3.1'})
//         .request({
//         "Messages":[
//             {
//             "From": {
//                 "Email": "cooldonamit251@gmail.com", 
//                 "Name": "AMIT"
//             },
//             "To": [
//                 {
//                 "Email": "lordsknight2511@gmail.com",
//                 "Name": "AMIT" 
//                 }
//             ],
//             "Subject": "Greetings from Mailjet.",
//             "TextPart": "My first Mailjet email",
//             "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
//             "CustomID": "AppGettingStartedTest"
//             }
//         ]
//         })
// request
//     .then((result) => {
//         console.log(result.body)
//     })
//     .catch((err) => {
//         console.log(err.statusCode)
//     })

const sendMail = (email,name) => {
    mailjet.post("send", {'version': 'v3.1'})
    .request({
    "Messages":[
        {
        "From": {
            "Email": "lordsknight2511@gmail.com",
            "Name": "Task manager"
        },
        "To": [
            {
            "Email": email,
            "Name": name
            }
        ],
        "Subject": "Greetings from Task Manager.",
        "TextPart": `Hello ${name}, thank you for joining task manager. `,
        "HTMLPart": `<h3>Dear ${name}, welcome to task manager app <\h3> May the delivery force be with you! \n thank you for joining task manager.`,
        "CustomID": "Task manager getting started"
        }
    ]
    })
    // .then((result)=> {
    //     console.log(result.body)
    // }).catch((e)=>{
    //     console.log(e)
    // })
}

const byeMail = (email,name) => {
    mailjet.post("send", {'version': 'v3.1'})
    .request({
    "Messages":[
        {
        "From": {
            "Email": "lordsknight2511@gmail.com",
            "Name": "Task manager"
        },
        "To": [
            {
            "Email": email,
            "Name": name
            }
        ],
        "Subject": "Sorry to see you go!",
        "TextPart": `Hello ${name}, good bye. `,
        "HTMLPart": `<h3>Dear ${name}, hope we see you back sometime soon .`,
        "CustomID": "Task manager getting started"
        }
    ]
    })
}

// sendMail('amit','amit')

module.exports = {sendMail,byeMail}