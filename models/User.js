const { Schema, model, Types } = require('mongoose');
const post = require('./Post.js');
const moment = require('moment');

const UserSchema = new Schema
(
  {
    username: {
      type: String,
      unique: [true, 'Username is already taken.'],
      required: 'Username is required.',
      trim: true
    },
    email: {
      type: String,
      unique: [true, 'Email is already in-use.'], 
      required: [ true, 'A valid email address is required.' ],
      validate: { validator: (email) => 
        { 
          return /[a-zA-z0-9]+@.+\..+/i.test(email); 
        },
        message: 'Invalid email address format. Should be: username@email.domain'
      }
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'post'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    memberSince: {
      type: Date,
      default: Date.now,
      get: memberSinceValue => moment(memberSinceValue).format('MM/DD/YYYY')
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

UserSchema.virtual('friendCount')
.get(function() {
  console.log("Scanning user's friend count...");
  console.log(this.friends);
  console.log(this.friends.length);
  return this.friends.length;
});

UserSchema.virtual('postCount')
.get(function() {
  console.log("Scanning user's post count...");
  console.log(this.posts);
  console.log(this.posts.length);
  return this.posts.length;
});

const User = model('User', UserSchema);

module.exports = User;