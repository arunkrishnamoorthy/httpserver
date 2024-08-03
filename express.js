const express = require('express');
const app = express();
const port = 8000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/tasks', (req,res) => {
    debugger;
});

app.post('/tasks', (req, res) => {
    debugger;
});