var express = require('express');
var router = express.Router();
const Post = require('../models/Post');

router.post(('/submit'), (req, res) => {
    const { postHeader, postContent, creatorName, postId } = req.body
    const post = { postHeader, postContent, creatorName, postId }

    Post.create(post)
        .then(post => {
            res.json({ status: post.postHeader + ' submitted!'});
        })
        .catch(err => {
            res.send('error: ' + err);
        })
})

router.get(('/fetch'), (req, res) => {
    Post.find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
    });
})

router.delete(('/delete/:id'), (req, res) => {
    console.log(req.params.id)
    Post.findOne({
        _id: req.params.id
    })
    .then(post => {
        if(post) {
            Post.deleteOne({
                _id: req.params.id
            })
            .then(() => {
                res.send({ message: "Der Post wurde erfolgreich gelöscht!" })
            })
        }else {
            res.send({ error: "Post konnte nicht gelöscht werden" })
        }
    })
})

module.exports = router