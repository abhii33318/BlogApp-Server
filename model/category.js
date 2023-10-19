const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
        
},{ timestamps: true });

const category = mongoose.model('category', CategorySchema);

module.exports=category