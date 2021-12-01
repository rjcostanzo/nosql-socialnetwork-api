const { User, Post } = require('../models');

const postController = {

  getAllPosts(req, res) {
    Post.find()
    .select('-__v')
    .then(dbPostData => res.status(200).json(dbPostData))
    .catch(e => { console.log(e); res.status(500).json(e); });
  },

  getPostById(req, res) {
    console.log(req.params);
    Post.findOne
    (
      {
        _id: req.params.id
      }
    )
    .select('-__v')
    .then(dbPostData => {
      if (!dbPostData) {
        return res.status(404).json({message: `Could not find post with ID ${req.params.id}`})
      }
      res.status(200).json(dbPostData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },

  addPost(req, res) {
    let postLocal;
    Post.create(
      {
        postText: req.body.postText,
        username: req.body.username,
        userId: req.body.userId
      }
    )
    .then(post => {
      postLocal = post;
      return User.findOneAndUpdate
      (
        {
          _id: req.body.userId
        },
        { $push: { posts: post._id } },
        {
          new: true,
        }
      )
      .populate(
        {
          path: 'posts',
          select: '-__v'
        }
      )
      .select('-__v')
    })
    .then(user => {
      if (!user) {
        res.status(404).json({message: `Could not find user with ID ${req.body.userId}`});
      }
      res.status(200).json(user); 
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },
  
  deletePost(req, res) {
    console.log(req.params);
    Post.findOneAndDelete
    (
      {
        _id: req.params.id
      }
    )
    .then(post => {
      console.log(post);
      if (!post) {
        return res.status(404).json({message: `Could not find post with ID of ${req.params.id}`});
      }
      return User.findOneAndUpdate
      (
        { _id: req.params.userId },
        { $pull: {posts: req.params.id} },
        { new: true }
      );
    })
    .then(userInfo => {
      if (!userInfo) {
        res.status(404).json({message: `Could not find user with ID ${req.params.userId}`});
      }
      res.status(200).json({message: `Post ${req.params.id} has been deleted from user ${req.params.userId}.`});
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },

  updatePost: async (req, res) => {
    try {
      const postInfo = await Post.findOneAndUpdate
      (
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      console.log(postInfo);
      if (!postInfo) {
        res.status(404).json({message: `Could not find post with ID ${req.params.id}`})
      }
      res.status(200).json(postInfo);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  
  addComment(req, res) {
    console.log(req.params);
    console.log(req.body);
    Post.findOneAndUpdate
    (
      { _id: req.params.id },
      { $push: { comments: req.body } },
      { new: true }
    )
    .then(dbPostData => {
      console.log(dbPostData);
      if (!dbPostData) {
        return res.status(404).json({message: `Could not find post with ID ${req.params.postId}`});
      }
      res.status(200).json(dbPostData);
    })
    .catch(e => { console.log(e); res.json(500).json(e); });
  },
  
  deleteComment(req, res) {
    console.log(req.params);
    Post.findOneAndUpdate
    (
      { _id: req.params.id },
      { $pull: { comments: { commentId: req.params.commentId } } },
      { new: true }
    )
    .then(dbPostData => {
      console.log(dbPostData);
      if (!dbPostData) {
        return res.status(404).json({message: `Could not find post with ID ${req.params.id} OR comment with ID ${req.params.commentId}.`})
      }
      res.status(200).json(dbPostData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },

  updateComment: async (req, res) => {
    console.log(req.params);
    console.log(req.body);
    try {
      const deletedComment = await Post.findOneAndUpdate
      (
        { _id: req.params.id },
        { 
          $pull: {
            comments: {
              commentId: req.params.commentId
            }
          }
        },
        { new: true } 
      );
      if (!deletedComment) {
        res.status(404).json({message: `Could not find post with ID ${req.params.id} OR comment with ID ${req.params.commentId}.`});
      }
      const newComment = await Post.findOneAndUpdate
      (
        { _id: req.params.id },
        {
          $push: {
            comments: req.body
          }
        },
        { new: true }
      );
      res.status(200).json(newComment);
    } catch (error) {
      console.log(error); res.status(500).json(error);
    }
  }
};

module.exports = postController;