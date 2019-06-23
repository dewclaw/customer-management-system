// Imports
let fs = require('fs');
let ejs = require('ejs');
let bodyBuilder = require('./library/bodyBuilder.js');

// Preload HTML pages, this should already be done in a database
let loadedPages = {
    index : fs.readFileSync(`./html/index.html`, 'utf8'),
    '404' : fs.readFileSync(`./html/404.html`, 'utf8'),
    getCustomers : fs.readFileSync(`./html/showCustomers.html`, 'utf8'),
    newCutomer : fs.readFileSync(`./html/newCustomer.html`, `utf8`)
}
// Customer or other user information, should also be loaded into a database 
let loadedDB = {
    customerData : JSON.parse(fs.readFileSync(`./jsonDB/customerDB.json`))
}
// GET request for the /
function getIndex(request,response){
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(loadedPages.index);
    response.end();
}
// GET request for /customers
function getCustomers(request,response){
    // console.log(loadedDB.customerData)
    // console.log(loadedPages.getCustomers)
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(ejs.render(loadedPages.getCustomers, {customers : loadedDB.customerData}));
    response.end();
}
// GET request for /newcustomer, page to add a new customer to the 'database' 
function getNewCustomer(request,response){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write(loadedPages.newCutomer);
    response.end();
}
// POST request for /newcustomer, 
function postNewCustomer(request,response,timeout){
    console.log("Information Posted")

    bodyBuilder.buildBody(request,timeout).then((body)=>{
        console.log(body);
    
    addNewCustomer(body)
    
        response.writeHead(301,{Location: 'http://localhost:8000/showcustomers'});
        response.end();
    })
}
// Write to customerDB function
function addNewCustomer(requestBody){
    let newCustObj = {
        "name" : requestBody.customerName,
        "phone1" : requestBody.customerPhone
    }
    fs.appendFile('./jsonDB/customerDB.json', JSON.stringify(newCustObj), (error)=>{
        if (error) throw error;
        console.log(`file write success.`)
    })
}



// GET request to any route not defined
function getUndefined(request,response){
    response.writeHead(404, {'Content-Type' : 'text/html'})
    response.write(loadedPages['404']);
    response.end();
}
module.exports = {
    getIndex : getIndex,
    getUndefined : getUndefined,
    getCustomers : getCustomers,
    getNewCustomer : getNewCustomer,
    postNewCustomer : postNewCustomer
}