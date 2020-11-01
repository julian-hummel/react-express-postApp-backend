const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
var router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

require('dotenv/config');

const myOAuth2Client = new OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    "https://developers.google.com/oauthplayground"
)

myOAuth2Client.setCredentials({
    refresh_token: process.env.REFRESHTOKEN
});

const myAccessToken = myOAuth2Client.getAccessToken()

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "postapp.informationservice@gmail.com", 
         clientId: process.env.CLIENTID,
         clientSecret: process.env.CLIENTSECRET,
         refreshToken: process.env.REFRESHTOKEN,
         accessToken: myAccessToken 
    }});

router.post('/sendemail',function(req,res){
    User.find({}, function(err, result) {
        if (err) {
          res.send({ 'error: ': err })
        } else {
            result.map(user => {
                if(user.email !== req.body.email && user.notification) {
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

router.post(('/commentNotification'), (req, res) => {
    Post.findOne({ postId: req.body.post }, function(err, post) {
        if(err) {
            res.send({ 'error: ': err })
        }else {
            User.findOne({ firstName: post.creatorName.split(' ')[0], lastName: post.creatorName.split(' ')[1] }, function(err, user) {
                if(err) {
                    res.send({ 'error: ': err })
                }
                if(user.notification) {
                    const mailOptions = {
                        from: 'postapp.informationservice@gmail.com', 
                        to: user.email, 
                        subject: req.body.creator + " hat einen deiner Posts kommentiert",
                        html: '<p>Hallo ' + user.firstName + ' ' + user.lastName + ', <br>' + req.body.creator + ' hat deinen Post ,,' + post.postHeader + '´´ kommentiert! <br> Grüße, <br> dein Post-App Service Team'
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
    })
})

module.exports = router

