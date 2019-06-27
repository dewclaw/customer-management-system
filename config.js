let serverConfig = {port : 8000, location : 'localhost'}
let mongoCreds = {username : 'ruser', password : 'rootpassword1'};
let corsHeaders = {
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
}
module.exports = {
    serverConfig : serverConfig,
    mongoCreds : mongoCreds,
    corsHeaders : corsHeaders
}