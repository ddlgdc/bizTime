/** BizTime express application. */

const express = require("express");
// imports express.js framework

const app = express();
// creates instances, 'app' is an object that represents your express app 
// using 'app' configure routes, middleware and other settings for your web app 

const companiesRouter = require('./routes/companies');
// imports the 'companiesRouter' object from thje './routes/companies'

const invoincesRouter = require('./routes/invoices');

const ExpressError = require("./expressError")

app.use(express.json());
/* mounts the built-in express middleware 'express.json()'. middleware parses
incoming request with JSON payloads, parses the incoming request body and makes it 
available in 'req.body' as a JS obj */

app.use ('/companies', companiesRouter);
// mounts the companiesRouter to express app at the '/companies' route 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
/* defines handling middleware function using 'app.use()'. middleware function 
will be called whenever an error occurs during the request processing */

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
// starts the express server and listens to incoming http requeset on specific port 

module.exports = app;