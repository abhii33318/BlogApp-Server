const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    blogImage: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
        
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required:true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'published', // Default status is "published"
      },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},{ timestamps: true });

blogSchema.virtual('formattedCreatedAt').get(function () {
    return this.createdAt.toLocaleDateString('en-GB'); // Format: dd-mm-yyyy
  });
  
  // Define a virtual property for formattedUpdatedAt
  blogSchema.virtual('formattedUpdatedAt').get(function () {
    return this.updatedAt.toLocaleDateString('en-GB'); // Format: dd-mm-yyyy
  });
const Blog = mongoose.model('blogs', blogSchema);

console.log("hii")

module.exports=Blog
