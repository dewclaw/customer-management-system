// Imports
const mongoose = require('mongoose');
const sConfig = require('../config.js');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CustomerSchema = new Schema({
    // id : ObjectId,
    name: String,
    phoneNumberOne: String,
    beginEditing: Boolean
});
const UserAccountSchema = new Schema({
    emailAddress: String,
    password: String
})

let CustomerModel = mongoose.model('Customer', CustomerSchema);
let UserAccountModel = mongoose.model('UserAccount', UserAccountSchema);


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

function parseCustomersDocument(rawDocument) {
    let custArray = []

    for (i = 0; i < rawDocument.length; i++) {
        let currentCust = rawDocument[i];
        custArray[i] = {
            'name': currentCust.name,
            'phone1': currentCust.phoneNumberOne,
            'beginEditing': currentCust.beginEditing,
            '_id': currentCust._id
        }
    }
    console.log(`parseCutomersDocument : ${custArray[0]}`)
    return custArray
}

function updateCustomer(submittedCustomer) {
    CustomerModel.findById(submittedCustomer._id, (error, retrievedCustomer) => {
        if (retrievedCustomer) {
            retrievedCustomer.name = submittedCustomer.name
            retrievedCustomer.phone1 = submittedCustomer.phone1
            retrievedCustomer.save()
            console.log("Update Success")
        } else {
            console.log(`Error Finding Customer ${error}`)
        }
    })
}

function getAllCustomers() {
    return new Promise((resolve, reject) => {
        try {
            CustomerModel.find({}).exec((error, customers) => {
                if (error) {
                    console.log(error)
                }
                resolve(customers)
                // let custArray = DBManager.parseCustomersDocument(customers)
                // response.end(JSON.stringify(custArray))
            })
        } catch (bigError) {
            reject(`Big Error ${bigError}`)
        }

    })
}

function addNewCustomer() {

}
// dbConnect()
// getAllCustomers().then((customers) => {
//     console.log(customers)
// })

// let tempCust = {
//     name: 'Dominic Gallo',
//     phone1: '6316721260',
//     beginEditing: false,
//     _id: '5d104870210ebcb09612e6f4'
//   }


//   updateCustomer(tempCust)
// Saving a new customer
// CustomerOne.save((error)=>{
//     if (error) throw error;
//     console.log("New Customer Saved Successfully");
// })

// Finding a customer by name 
// CustomerModel.find({
//     'name' : /dewclaw/i,
// }).exec((error,customers)=>{
//     if (error || customers.length < 1){
//         console.log("Customer Not Found")
//         return
//     };
//     console.log(customers)
// });


// find a customer by ID
// CustomerModel.findById("5d104870210ebcb09612e6f4", (error,user)=>{
//     if(user){
//         user.name = "Dom Gallo"
//         user.save()
//         console.log("UPDATE SUCCESS")
//     } else {
//         console.log(`Error : ${error}`)
//     }
// })


// Finding all in a collection 
// Customer.find({}).exec((error,customers)=>{
//     if(error) throw error;
//     console.log(customers)
// })



module.exports = {
    dbConnect: dbConnect,
    Customermodel: CustomerModel,
    UserAccountModel: UserAccountModel,
    parseCustomersDocument: parseCustomersDocument,
    getAllCustomers : getAllCustomers,
    updateCustomer : updateCustomer
}