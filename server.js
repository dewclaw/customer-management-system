// Imports
let http = require('http');
let Routes = require('./routes.js')
// Config
let sConfig = require('./config.js')

let server = http.createServer((request,response)=>{
    console.log(`${request.connection.remoteAddress} ------> ${request.method} -------> ${request.url}`)

    switch (request.url) {
        case '/':
            {
                Routes.getIndex(request,response);
            }
            break;
        case '/showcustomers':
            {
                Routes.getCustomers(request,response);
            }
            break;
        case '/newcustomer':
            if (request.method == 'GET') {
                Routes.getNewCustomer(request,response)
            } else if (request.method == 'POST') {
                Routes.postNewCustomer(request,response,10000)
            }
            break
        default:
            {
                Routes.getUndefined(request,response);
            }
    }
});

server.listen(sConfig.port,sConfig.location, ()=>{console.log(`Server is listening on ${sConfig.location}:${sConfig.port}`)})

