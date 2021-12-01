const router = require('express').Router();

const { getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriend } = require('../../controllers/userController.js');

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:id/friends/:friendId')
    .post(addFriend);

router.route('/:id/friends/:friendId')
    .delete(deleteFriend);

module.exports = router;