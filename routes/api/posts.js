const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Get Post mongo model
const Post = require("../../models/Post");
// Get Profile mongo model
const Profile = require("../../models/Profile");
// Validation
const validatePostInput = require("../../validation/post");

// @route  GET api/posts/test
// @desc   Tests posts route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route  Get api/posts
// @desc   Get posts
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 }) // sort by the date from early to old
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route  Get api/posts/:id
// @desc   Get a post by id
// @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check validation
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check the post owner
          if (post.user.toString() !== req.user.id) {
            // remember to user "toString()", because the origin type of "post.user" is "object"!!!!!
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" }); // 401 is the auth error
          }

          // Start deleting
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route  POST api/posts/like/:id
// @desc   Like a post
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if the user has already liked this post
          // remember to user "toString()", because the origin type of "post.user" is "object"!!!!!
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res
              .status(400)
              .json({ notauthorized: "User already liked this post" });
          }

          // Add user it to the "likes" array
          post.likes.unshift({ user: req.user.id });
          // Save the post
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route  POST api/posts/unlike/:id
// @desc   Unlike a post
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if the user has already liked this post
          // remember to user "toString()", because the origin type of "post.user" is "object"!!!!!
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }

          // Get the remove index and remove the user from the "likes" array
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check validation
        const { errors, isValid } = validatePostInput(req.body);
        if (!isValid) {
          return res.status(400).json(errors);
        }

        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comment array
        post.comments.unshift(newComment);
        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(400).json({ postnotfound: "No post found" }));
  }
);

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove comment from post
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if the comment exists
        if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist " });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Remove and save
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(400).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
