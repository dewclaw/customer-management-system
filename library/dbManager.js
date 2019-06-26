// Imports
const mongoose = require('mongoose');
const sConfig = require('../config.js');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CustomerSchema = new Schema({
    // id : ObjectId,
    name: String,
    phoneNumberOne: String
});

let CustomerModel = mongoose.model('Customer', CustomerSchema);

var CustomerOne = new CustomerModel({
    name: "Juliana",
    phoneNumberOne: "6316721260"
});

function dbConnect() {
    mongoose.connect(`mongodb://${sConfig.mongoCreds.username}:${sConfig.mongoCreds.password}@ds161069.mlab.com:61069/dataclaw`, {
        useNewUrlParser: true
    }).then((
        () => {
            console.log("MONGODB CONNECTION SUCCESS"),
                (error) => {
                    throw error
                }
        }
    ));
}
function parseCustomersDocument(rawDocument){
    let custArray = []
    for(i = 0; i < rawDocument.length; i++){
        let currentCust = rawDocument[i];
        custArray[i] = {'name' : currentCust.name, 'phone1' : currentCust.phoneNumberOne}
    }
    return custArray
}
// dbConnect()

// Saving a new customer
// CustomerOne.save((error)=>{
//     if (error) throw error;
//     console.log("New Customer Saved Successfully");
// })

// Finding a customer by name 
// Customer.find({
//     name : /dom/i,
// }).exec((error,customers)=>{
//     if (error) throw error;
//     console.log(customers);
//     console.log(customers[0].name)
// });

// Finding all in a collection 

// Customer.find({}).exec((error,customers)=>{
//     if(error) throw error;
//     console.log(customers)
// })



module.exports = {
    dbConnect : dbConnect,
    Customermodel : CustomerModel,
    parseCustomersDocument : parseCustomersDocument
}