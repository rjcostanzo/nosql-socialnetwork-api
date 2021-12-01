const { User, Post } = require('../models');
const db = require('../models');

const userController = {

    getAllUsers(req, res) {
        console.log(req.path);
        User.find()
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(e => { console.log(e); res.status(500).json(e) });
    },

    getUserById(req, res) {
        console.log(req.params);
        User.findOne
        (
            {
                _id: req.params.id
            }
        )
    .populate(
      {
        path: 'posts',
        select: '-__v'
      },
    )
    .populate(
      {
        path: 'friends',
        select: '-__v'
      }
    )
    .select('-__v')
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({message: `There is no user with an ID of ${req.params.id}`})
        }
        res.status(200).json(dbUserData);
        })
        .catch(e => { console.log(e); res.status(500).json(e) });
    },
  
  createUser(req, res) {
    console.log(req.body);
    User.create(req.body)
    .then(dbUserData => res.json(dbUserData))
    .catch(e => { console.log(e); res.status(500).json(e) });
  },
  
  updateUser(req, res) {
    console.log(req.params);
    console.log(req.body);
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({message: `There is no user with an ID of ${req.params.id}`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e) });
  },
  
  deleteUser: async (req, res) => {
    console.log(req.body)
    console.log(req.params);
    try {
      const deletedPosts = await Post.deleteMany
      (
        { username: req.body.username }
      );
      console.log(deletedPosts);
      const deletedFriend = await User.updateMany
      (
        {},
        {
          $pull: {
            friends: req.params.id
          }
        }
      );
      console.log(deletedFriend);
      const deletedUser = await User.findOneAndDelete
      (
        { _id: req.params.id }
      );
      console.log(deletedUser);
      if (!deletedUser) {
        res.status(404).json({message: `There is no user with an ID of ${req.params.id}`});
      }
      res.status(200).json({message: `${req.body.username} and their posts have been deleted.`});
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  addFriend(req, res) {
    console.log(req.params);
    User.findOneAndUpdate
    (
      { 
        _id: req.params.id 
      },
      { 
        $push: { friends: req.params.friendId } 
      },
      { 
        new: true 
      }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: `There is no user with an ID of ${req.params.id}`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },

  deleteFriend(req, res) {
    console.log(req.params);
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: `There is no user with an ID of ${req.params.id}`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  }
};

module.exports = userController;