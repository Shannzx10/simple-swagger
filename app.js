const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Sajikan file index.html di path /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Sajikan file swagger.html di path /swagger-ui
app.get('/swagger-ui', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.html'));
});

// Sajikan file swagger.json di path /swagger.json
app.get('/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.json'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});