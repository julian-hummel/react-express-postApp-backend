var express = require('express');
var router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

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

router.post(('/submitComment'), (req, res) => {
    const { content, creator, post } = req.body
    const comment = { content, creator, post }

    Comment.create(comment)
        .then(comment => {
            res.json({ status: 'Kommentar von ' + comment.creator + ' veröffentlicht!'})
        })
        .catch(err => {
            res.json({ 'error': err })
        })
})

router.get(('/fetchComments/:postId'), (req, res) => {
    Comment.find({ post: req.params.postId }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
    });
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