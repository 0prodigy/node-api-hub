const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')

//Load post modal
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
//Load validator
const validatePostInput = require('../../valIdator/post')

// @route GET api/posts/test
// @desc Tets posts route
// @access  Public

router.get('/test', (req, res) => {
    res.json({
        msg: "users works"
    })
});

// @route Post api/posts/
// @desc  posts blog
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { error, isValid } = validatePostInput(req.body);

    if (!isValid) {
        // error.post ="You are not eligible for post"
        return res.send(404).json({ err: "unable to post" })
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post));
})

// @route Get api/posts/
// @desc  get blog posts
// @access  Public
router.get('/', (req, res) => {
    Post.find().sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status({ noPost: "NO post found with that id" }));

});

// @route Get api/posts/post_id
// @desc  get blog post
// @access  Public

router.get('/:post_id', (req, res) => {
    Post.findOne({ _id: req.params.post_id })
        .then(post => res.json(post))
        .catch(err => res.json({ noPost: "NO post found with that id" }));
})

// @route Delete api/posts/post_id
// @desc  get blog post
// @access  Private
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(Profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    //Check post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(404).json({ onwer: "you dont own this post" });
                    }
                    post.remove().then(() => res.json({ sucess: true }));
                })
                .catch(err => res.json({ post: "Post Not Found" }));
        })
})

// @route Like api/posts/post_id
// @desc  Like blog post
// @access  Private
router.post('/like/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    //Check post owner
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(404).json({ liked: "you already liked  this post" });
                    }
                    // Add user into like array
                    post.likes.unshift({ user: req.user.id });
                    post.save().then(() => res.json(post));
                })
                .catch(err => res.json({ post: "Post Not Found" }));
        });
});

// @route unlike api/posts/post_id
// @desc  unLike blog post
// @access  Private
router.post('/unlike/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    //Check post owner
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(404).json({ liked: "you didnt liked  this post" });
                    }
                    // find user index in like array
                    const removeIndex = post.likes.map(
                        like => like.user.toString()
                    ).indexOf(req.user.id);
                    // splice from array 
                    post.likes.splice(removeIndex, 1);

                    //save 
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.json({ post: "Post Not Found" }));
        });
});

// @route Post api/comment/:post_id
// @desc  conmment on blog post
// @access  Private
router.post('/comment/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { error, isValid } = validatePostInput(req.body);

    if (!isValid) {
        // error.post ="You are not eligible for post"
        return res.send(404).json({ err: "unable to post" })
    }
    Post.findById(req.params.post_id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //add to comment array

            post.comments.unshift(newComment);

            post.save().then(post => res.json(post))
        }).catch(err => res.json({ noPost: "no post found" }));
})

// @route Delete api/comment/:post_id/:comment_id
// @desc  conmment on blog post
// @access  Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { error, isValid } = validatePostInput(req.body);

    if (!isValid) {
        // error.post ="You are not eligible for post"
        return res.send(404).json({ err: "unable to post" })
    }
    Post.findById(req.params.post_id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ comment: "Comment not found on this post" })
            }

            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);


            //remove from comment array
            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.json(post))
        }).catch(err => res.json({ noPost: "no post found" }));
})


module.exports = router;