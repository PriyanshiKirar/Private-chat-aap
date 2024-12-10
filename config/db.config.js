const mongoose = require("mongoose");

async function connectedDb() {
    mongoose.connect("mongodb://127.0.0.1:27017/chating")
        .then(() => {
            console.log("Connected to the database successfully");
        })
        .catch((err) => {
            console.error("Error connecting to the database:", err);
        });
}

// Call the function to test the connection
connectedDb();

module.exports=mongoose.connection;