/** Database setup for BizTime. */

const { Client } = require('pg'); 
/* extracts the 'Client" class from the "pg" modules.
    "pg" is the official PostgreSQL client for Node.js
    by importing "Client" class, you can create instances */


const client = new Client({
    user: 'diego',         // postgres username
    host: 'localhost',      // where postgres server is running 
    database: 'biztime',    // name of the database connected to 
    password: '011601',     // postgres password
    port: '5432'            // port on which your postgres server is listening 
});


client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to the database', err.stack));
/* initiates a connected to postgres database using connect() 
    method of client object, it returns a promise, if succesful, the then block runs 
    if error, catch block runs */

    
module.exports = client;
/* exports the client object so that it can be imported and used in other modules 
    of my node.js app. also allows operations like querying, inserting, updating or 
    deleting data */