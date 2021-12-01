const { Schema, model, Types } = require('mongoose');
const User = require('./User.js');
const moment = require('moment');

const CommentSchema = new Schema
(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    commentBody: {
      type: String,
      required: [true, 'Text is required for a comment'],
      maxlength: 280
    },
    username: {
      type: String,
      required: [true, 'A username is required for this request.']
    },  
    userId: {
      type: String,
      required: [true, 'A valid user ID is required for this request.'] //
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format('MM/DD/YYYY [at] hh:mm a')
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
)

const PostSchema = new Schema
(
  {
    postText: {
      type: String,
      required: [true, 'Text is required for this post.'],
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MM/DD/YYYY [at] hh:mm a')
    },
    comments: [CommentSchema],
    username: {
      type: String,
      required: [true, 'A valid username is required for this post.'] //
    },
    userId: {
      type: String,
      required: [true, 'A valid user ID is required for this post.']
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

PostSchema.virtual('commentCount')
.get(function() {
  return this.comments.length;
});

const Post = model('Post', PostSchema);

module.exports = Post;