// Imports
let http = require('http');
let Routes = require('./routes.js')
let DBManager=  require('./library/dbManager.js')

// Config
let sConfig = require('./config.js')

// Connect to MongoDB
DBManager.dbConnect();

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
                DBManager.Customermodel.find({}).exec((error,customers)=>{

                    if(error) throw error;

                    let custArray = DBManager.parseCustomersDocument(customers)
                    // console.log(custArray)
                    // for (customer of customers){
                    //     console.log(customer)
                    // }


                    // let custArray = customers.map(customer => customer.name)
                    // console.log(custArray)
                    Routes.getCustomers(request,response,custArray);
                });
                
            }
            break;
        case '/newcustomer':
            if (request.method == 'GET') {
                Routes.getNewCustomer(request,response)
            } 
            else if (request.method == 'POST') {
                // POST request function
                Routes.postNewCustomer(request,response,10000)
            }
            break
        default:
            {
                Routes.getUndefined(request,response);
            }
    }
});

server.listen(sConfig.serverConfig.port,sConfig.serverConfig.location, ()=>{console.log(`Server is listening on ${sConfig.serverConfig.location}:${sConfig.serverConfig.port}`)})

