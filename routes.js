// Imports
let fs = require('fs');
let ejs = require('ejs');
let bodyBuilder = require('./library/bodyBuilder.js');

// Preload HTML pages, this should already be done in a database
let loadedPages = {
    index: fs.readFileSync(`./html/index.html`, 'utf8'),
    '404': fs.readFileSync(`./html/404.html`, 'utf8'),
    getCustomers: fs.readFileSync(`./html/showCustomers.html`, 'utf8'),
    newCutomer: fs.readFileSync(`./html/newCustomer.html`, `utf8`)
}
// Customer or other user information, should also be loaded into a database 
let loadedDB = {
    customerData: JSON.parse(fs.readFileSync(`./jsonDB/customerDB.json`))
}
// GET request for the /
function getIndex(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write(loadedPages.index);
    response.end();
}
// GET request for /customers
function getCustomers(request, response, customerArray) {
    // console.log(loadedDB.customerData)
    // console.log(loadedPages.getCustomers)

    // console.log(customerArray);

    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    //                                                  LOAD IN CUSTOMERS FROM DATABASE HERE
    response.write(ejs.render(loadedPages.getCustomers, {
        customers: customerArray
    }));
    response.end();
}
// GET request for /newcustomer, page to add a new customer to the 'database' 
function getNewCustomer(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write(loadedPages.newCutomer);
    response.end();
}
// POST request for /newcustomer, 
function postNewCustomer(request, response, timeout, customerModel) {
    console.log("Information Posted")

    // Parse Body to an object
    bodyBuilder.buildBody(request, timeout).then((body) => {
        // Post to database
        console.log(body)
        console.log(`New Customer Being Added: \n Customer Name : ${body.customerName} \n Customer Phone : ${body.customerPhone}`);
        // Call DB to save new customer
        let custToAdd = new customerModel({
            name: body.customerName,
            phoneNumberOne: body.customerPhone,
            beginEditing: false
        }).save(error => {
            if (error) {
                console.log("Error Saving Customer....Redirecting");
                response.writeHead(301, {
                    Location: 'localhost:8000/showcustomers'
                })
                throw error
            }
            console.log("Customer Added Successfully.... Redirecting")
            response.writeHead(301, {
                Location: 'http://localhost:8000/showcustomers'
            });
            response.end();
        })
    })
}

function apiAuthPost(request, response, timeout, UserAccountModel) {
    bodyBuilder.buildBody(request, timeout).then((body) => {
        var isAuth = false
        let tempAcc = {
            emailAddress: body.username,
            password: body.pw
        }
        let message = {
            content: {
                isAuth: isAuth
            }
        }
        if (body.picked == 'LoginSelected') {
            UserAccountModel.find({
                emailAddress: tempAcc.emailAddress
            }).exec((error, UserObj) => {
                if (error) {
                    console.log(`error finding match ${error}`)
                } else if (UserObj.length < 1) {
                    console.log("Email Does Not Exist")
                    isAuth = false
                    response.end(JSON.stringify(message))
                } else if (tempAcc.emailAddress == UserObj[0].emailAddress && tempAcc.password == UserObj[0].password) {
                    console.log("User Has Been Authenticated")
                    message.content.isAuth = true
                    console.log(message)
                    response.end(JSON.stringify(message))
                } else {
                    console.log(UserObj)
                    response.end(JSON.stringify(message))
                }

            })
        }
    })
}

function apiCustomersGet(request, response, DBManager) {

    DBManager.getAllCustomers().then((customers) => {
        let custArray = DBManager.parseCustomersDocument(customers)
        // Routes.getCustomers(request, response, custArray);
        response.end(JSON.stringify(custArray))
    })

}
// Either Adds or Updates the customer depending on whether the 
// requesting coming in has been 'tagged' with the isNew attribute
function apiCustomersPost(request, response, DBManager) {
    bodyBuilder.buildBody(request, 70000).then((body) => {
        console.log('apiCustomersPost : Body Parsed')
        console.log(body)

        if (body.isNew == undefined || body.isNew == false) {
            // Customer Currently Exists in DB
            console.log("Update Existing Customer")
            DBManager.updateCustomer(body)
            // More Detailed Response Here
        } else {
            // Customer Does Not Currently Exist in DB
            console.log("Add New Customer")
            DBManager.addNewCustomer(body)
        }

        response.end(JSON.stringify({
            message: "received"
        }))
    })
}
// Finds the _id and deletes it from the database

function apiCustomersDelete(request, response, DBManager) {
    console.log("DELETE REQUEST RECEIVED...")
    bodyBuilder.buildBody(request, 70000).then((body) => {
        let id = body._id._id
        console.log(`DELETE REQUEST BODY PARSED \n _id: ${id}`)

        // CALL DELETE FUNCTION 
        // DBManager.deleteCustomer(body._id).exec((error,document)=>{
        //     if(error){
        //         throw error
        //     }
        //     console.log(`DELETED ${document}`)
        // })
        DBManager.CustomerModel.findByIdAndDelete(body._id, (error, document) => {
            if (error) {
                throw error
            }
            console.log(`Success ${document}`)
        })
    })
}


// GET request to any route not defined
function getUndefined(request, response) {
    response.writeHead(404, {
        'Content-Type': 'text/html'
    })
    response.write(loadedPages['404']);
    response.end();
}
module.exports = {
    getIndex: getIndex,
    getUndefined: getUndefined,
    getCustomers: getCustomers,
    getNewCustomer: getNewCustomer,
    postNewCustomer: postNewCustomer,
    apiAuthPost: apiAuthPost,
    apiCustomersGet: apiCustomersGet,
    apiCustomersPost: apiCustomersPost,
    apiCustomersDelete: apiCustomersDelete
}



// Write to customerDB function
// function addNewCustomer(requestBody){
//     let newCustObj = {
//         "name" : requestBody.customerName,
//         "phone1" : requestBody.customerPhone
//     }
//     // fs.appendFile('./jsonDB/customerDB.json', JSON.stringify(newCustObj), (error)=>{
//     //     if (error) throw error;
//     //     console.log(`file write success.`)
//     // })
//     console.log(newCustObj.name)
// }

// function apiShowCustomers(request,response){

// }