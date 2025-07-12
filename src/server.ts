/* eslint-disable no-console */
import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";


let server: Server;


const startServer = async() => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("connected to database");

        server = app.listen(5000, () => {
            console.log(`server is running on port ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }

}
startServer();

// unhandled rejections

process.on("unhandledRejection", (err)=>{
    console.log("Unhandled rejection detected, server shutting down!", err);
    if(server){
        server.close(()=>{
            process.exit(1);
        });
    }

    process.exit(1);

})

// uncaught rejection error
process.on("uncaughtException", (err)=>{
    console.log("Uncaught rejection detected. Server shutting down gracefully!", err);

    if(server){
        server.close(()=>{
            process.exit(1)
        });
    }

    process.exit(1);
})


// signal termination
process.on("SIGTERM", ()=>{
    console.log("Sigterm error detected, server shutting down gracefully!");

    server.close(()=>{
        process.exit(1);
    });
    process.exit(1);
})

// process.on("SIGINT", ()=>{
//     console.log("Sigterm error detected, server shutting down gracefully!");

//     server.close(()=>{
//         process.exit(1);
//     });
//     process.exit(1);
// })



// Promise.reject(new Error("Unhandled rejection on duty it seems"));

// throw new Error("I forgot to handle this local error!")

