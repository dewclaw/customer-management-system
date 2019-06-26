// Imports
let http = require('http');
let Routes = require('./routes.js')
let DBManager = require('./library/dbManager.js')

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
            response.writeHead(404, {'Content-Type' : 'text/html'})
            response.end("Unauthorized Method On Route")
        }

    }
    break;
    case '/newcustomer':
        if (request.method == 'GET') {
            Routes.getNewCustomer(request, response)
        } else if (request.method == 'POST') {
            // POST request function
            let custModel = DBManager.Customermodel;
            Routes.postNewCustomer(request, response, 10000, custModel)
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