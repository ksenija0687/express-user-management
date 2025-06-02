const express = require("express");

const port = 3011
const app = express();

app.use(express.json());

app.listen(port,()=>{
    console.log(`server is running http://localhost:${port}`);
    //local host ip address is 127.0.0.1
});


