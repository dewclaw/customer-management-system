// Imports
let http = require('http');
let Routes = require('./routes.js')
let DBManager = require('./library/dbManager.js')
let fs = require('fs')
// Config
let sConfig = require('./config.js')

// Connect to MongoDB
DBManager.dbConnect();

let server = http.createServer((request, response) => {

    console.log(`${request.connection.remoteAddress} ------> ${request.method} -------> ${request.url}`)

    switch (request.url) {
        case '/': {
            Routes.getIndex(request, response);
        }
        break;
    case '/showcustomers': {
        if (request.method == 'GET') {
            DBManager.Customermodel.find({}).exec((error, customers) => {
                if (error) throw error;
                let custArray = DBManager.parseCustomersDocument(customers)
                Routes.getCustomers(request, response, custArray);
            });
        } else {
            response.writeHead(404, {
                'Content-Type': 'text/html'
            })
            response.end("Unauthorized Method On Route")
        }
    }
    break;
    case '/newcustomer': {
        if (request.method == 'GET') {
            Routes.getNewCustomer(request, response)
        } else if (request.method == 'POST') {
            // POST request function
            let custModel = DBManager.Customermodel;
            Routes.postNewCustomer(request, response, 10000, custModel)
        }
    }
    break
    case '/api/customers': {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
            /** add other headers as per requirement */
        })
        if (request.method == 'GET') {
            Routes.apiCustomersGet(request,response,DBManager)
        } else if(request.method == 'POST'){
            Routes.apiCustomersPost(request,response,DBManager)
        } else if(request.method == 'DELETE'){
            console.log("DELETE REQUEST RECEIVED...")
            response.end(JSON.stringify({
                message: 'DELETE REQUEST RECEIVED'
            }))
        }

    }
    break

    case '/api/auth': {
        // Write CORS HEADER 
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
            /** add other headers as per requirement */
        })
        if (request.method == 'POST') {
            Routes.apiAuthPost(request, response, 10000, DBManager.UserAccountModel)
        } else if (request.method == 'GET') {
            resObj = {
                content: "No Get Here"
            }
            response.end(JSON.stringify(resObj))
        }
    }
    break
    default: {
        Routes.getUndefined(request, response);
    }
    }
});

server.listen(sConfig.serverConfig.port, sConfig.serverConfig.location, () => {
    console.log(`Server is listening on ${sConfig.serverConfig.location}:${sConfig.serverConfig.port}`)
})