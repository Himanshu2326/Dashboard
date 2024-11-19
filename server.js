// server.js

require('dotenv').config(); 
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const connection = require('./db'); 
const port = process.env.PORT || 3000;

/*
====================================================
? => Middleware to parse JSON data from requests
====================================================
*/
app.use(express.json());

/*
====================================================
? => Set EJS as the templating engine
====================================================
*/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/*
====================================================
? => Serve static files from the public directory
====================================================
*/
app.use(express.static(path.join(__dirname, './public')));
app.use(cors()); // Enable CORS for all routes

/*
====================================================
? => Route to add UTM data
====================================================
*/
app.post('/add-utm', (req, res) => {
  const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } = req.body;
  
  const sql = `
    INSERT INTO utm_data (utm_source, utm_medium, utm_campaign, utm_term, utm_content)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  connection.query(sql, [utm_source, utm_medium, utm_campaign, utm_term, utm_content], (err, result) => {
    if (err) {
      console.error("Error inserting UTM data:", err);
      res.status(500).json({ error: "Error inserting UTM data" });
    } else {
      res.status(201).json({ message: "UTM data added successfully", id: result.insertId });
    }
  });
});

/*
====================================================
? => Render the main dashboard page
====================================================
*/
app.get('/', (req, res) => {
  res.render('index', { title: 'UTM Tracking Dashboard' });
});

/*
====================================================
? => Route to get UTM data with optional month and year filters
====================================================
*/
app.get('/utm-data', (req, res) => {
  const { month, year } = req.query;

  let sql = "SELECT * FROM utm_data";
  let params = [];

  if (month && year) {
    sql += " WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?";
    params.push(parseInt(month, 10), parseInt(year, 10));
  }

  sql += " ORDER BY created_at DESC";

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching UTM data:", err);
      res.status(500).json({ error: "Error fetching UTM data" });
    } else {
      res.status(200).json(results);
    }
  });
});

/*
====================================================
? => Start the server
====================================================
*/
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});