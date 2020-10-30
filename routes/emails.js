const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
var router = express.Router();
const User = require('../models/User');

const myOAuth2Client = new OAuth2(
    "345577953309-2i0lqc2crq150vh5ugjo7s0mkashrgar.apps.googleusercontent.com",
    "7I7dJKUJOGktPbnGYPmYrESZ",
    "https://developers.google.com/oauthplayground"
)

myOAuth2Client.setCredentials({
    refresh_token:"1//04lLqoaKNqbm-CgYIARAAGAQSNwF-L9IrKreduxyWhopVJJCP8QA6lQVFpWqLOMPP_ID5-TCxKMfx7praTr0LCENQbE48ZsdxD_o"
});

const myAccessToken = myOAuth2Client.getAccessToken()

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "postapp.informationservice@gmail.com", 
         clientId: "345577953309-2i0lqc2crq150vh5ugjo7s0mkashrgar.apps.googleusercontent.com",
         clientSecret: "7I7dJKUJOGktPbnGYPmYrESZ",
         refreshToken: "1//04lLqoaKNqbm-CgYIARAAGAQSNwF-L9IrKreduxyWhopVJJCP8QA6lQVFpWqLOMPP_ID5-TCxKMfx7praTr0LCENQbE48ZsdxD_o",
         accessToken: myAccessToken 
    }});

router.post('/sendemail',function(req,res){
    var users = []
    User.find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
            result.map(user => {
                if(user.email !== req.body.email) {
                    const mailOptions = {
                        from: 'postapp.informationservice@gmail.com', 
                        to: user.email, 
                        subject: "Hallo " + user.email + ". Ein neuer Beitrag wurde erstellt!",
                        html: '<p>Schau doch mal in der Post-App vorbei! Ein neuer Beitrag wurde erstellt!</p>'
                    } 
                    transport.sendMail(mailOptions,function(err,result){
                        if(err){
                            res.send({ message:err })
                        }else{
                            transport.close();
                            res.send({ message:'Email wurde erfolgreich gesendet.' })
                        }
                    })
                }
            })
        }
    });  
})

module.exports = router

