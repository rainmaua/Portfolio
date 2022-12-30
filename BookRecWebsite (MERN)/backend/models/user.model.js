const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true, 
        unique: true
    },
    password: {
        type:String, 
        required: true
    },
    quote: {
        type: String
    },
    post: {
        type: [String]
    }
    
}, {
    collection: 'user-data'
// },
//     {
//     timestamps:true, 
}); 

const model = mongoose.model('UserInfo', User); 

module.exports = model; 
