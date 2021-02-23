const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use((error,req,res,next) =>{
    console.log(error);
    return res.sendStatus(500);
});

module.exports = app;