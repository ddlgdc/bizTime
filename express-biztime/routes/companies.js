const express = require('express'); 
// imports web app express.js framework

const router = express.Router(); 
// creates instance. router in express are middleware that can be used 
// to group router handlers together based on common route prefix

const db = require('../db');
// imports db object from '../db' module

// --- This route returns list of companies --- 
router.get('/', async (req, res, next) => { 
// defines a route for GET request to the /companies route
// uses router.get() method to specify the HTTP method and route path

    try { // begins a try block for handling potential errors that may occur

        const result = await db.query('SELECT code, name FROM companies');
        /* executes a SQL query againts the database to retrieve the 'code' and 
        'name' columns from the 'companies' table'. uses await to wait to complete 
        before moving to the next line */

        return res.json({ companies: result.rows });
        /* if query successful, this line sends a JSON response back to the client 
        with the list of companies obtained from the database. response is format 
        '{ companies: [{ code, name}]}' */

    }
    catch (err) { // beigns a catch block handle error that may occur within try block

        return next(err);
        // if error occurs, this line calls the next() function with 'err' param. 
    }
});

// --- Returns company details by code ---
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const company = result.rows[0];
        const invoiceResult = await db.query('SELECT id FROM invoices WHERE comp_code = $1', [code]);
        const invoices = invoiceResult.rows.map(row => row.id);

        return res.json({
            company: {
                code: company.code,
                name: company.name,
                description: company.description,
                invoices: invoices
            }
        });
    }
    catch (err) {
        return next(err);
    }
});

// --- Adds a new company ---
router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);

        return res.status(201).json({ company: result.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});

// --- Edit existing company --- 
router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;

        const result = await db.query('UPDATE companies SET name = $1, description = $2 WHERE code = $3 returning *', [name, description, code]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Company not found' });
        }
        return res.json({ company: result.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});

// --- Delete existing company --- 
router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        
        const result = await db.query('DELETE FROM companies WHERE code = $1 RETURNING *', [code]);

        if (result.rows.length === 0){
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.json({ status: 'deleted' });
    }
    catch (err){
        return next(err);
    }
});

module.exports = router;
// exports the router obj so that it can be used in other parts of the app 