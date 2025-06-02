const express = require("express");

const port = 3011
const app = express();

console.log("Starting server setup...");

// http://localhost:3011/
app.use(express.json());

console.log("Setting up routes...");

app.get("/", (req, res) => {
      console.log("ROOT ROUTE HIT!");
    res.status(200).send("Hello World");
});

console.log("Starting server...");

app.listen(port,()=>{
    console.log(`server is running http://localhost:${port}`);
    //local host ip address is 127.0.0.1
});


