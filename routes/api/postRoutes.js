const router = require('express').Router();

const { addPost, deletePost, addComment, deleteComment, getAllPosts, getPostById, updatePost, updateComment } = require('../../controllers/postController.js');

router.route('/')
    .get(getAllPosts)
    .post(addPost);

router.route('/:id')
    .get(getPostById)
    .put(updatePost)

router.route('/:id/users/:userId')
    .delete(deletePost);

router.route('/:id/comments/')
    .post(addComment);

router.route('/:id/comments/:commentId')
    .put(updateComment)
    .delete(deleteComment);

module.exports = router;