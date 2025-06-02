const express = require("express");

const port = 3011
const app = express();

//http://localhost:3011/
app.use(express.json());

const users = [];

app.get("/", (req,res) => {
    res.status(200).send("Hello World");
});


app.listen(port,()=>{
    console.log(`server is running http://localhost:${port}`);
    //local host ip address is 127.0.0.1
});


