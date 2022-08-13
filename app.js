const express = require("express");
require("./db");
const Routerss = require("./router")
//  const Productss = require("./router/Products")
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());
// app.use(cors());
// app.use(express.json());

app.use(Routerss)
// app.use(Productss)


app.listen(port, () => {
    console.log(`connection is setup at localhost:${port}`)
})