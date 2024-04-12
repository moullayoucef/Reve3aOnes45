const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const  app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000



// fin de l'importation 
app.use(cors({
    origin : ["http://localhost:5000"],
    credentials : true,
    optionsSuccessStatus : 200
}))
app.use(cookieParser());
app.use(express.json());

app.use("/auth",require("./router/authrouter"));
app.use("/user",require("./router/userrouter"))
app.use("/post",require("./router/postrouter"))
app.use("/comment",require("./router/commentrouter"))

// dbconnection 
mongoose.connect(process.env.DBPATH);
const db = mongoose.connection;
db.once('open',()=>{
    console.log('je suis bien connecté avec la base de donné ');
    app.listen(port,()=>{
        console.log('je suis bien connécté avec le server');
    })
})
db.on('error',(err)=>{
    console.log(err);
})
