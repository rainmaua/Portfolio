const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Contact = new Schema({
    name:{
        type: String
    },
    email: {
        type:String,
        required: true
    },
    title: {
        type:String, 
        required: true
    },
    description: {
        type: String
    }
    
}, {
    collection: 'contact-data'
// },
//     {
//     timestamps:true, 
}); 

const model = mongoose.model('ContactInfo', Contact); 

module.exports = model; 
