/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { handleZodError } from "../helper/handleZodError";
import { handleDuplicateError } from "../helper/handleDupliateError";
import { handleCastError } from "../helper/handleCastError";
import { handleValidationError } from "../helper/handleValidationError";
import { TerrorSources } from "../interfaces/error.types";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction)=>{

    if(envVars.NODE_ENV === "development"){
        console.log(err);
    };
    
    let statusCode = 500;
    let message = `Something went wrong!! ${err.message}`;
    let errorSources: any = []



    // duplicate error
    if(err.code === 11000){

        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;

    // Cast error/ ObjectId Error
    } else if(err.name === "CastError"){
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;

    } 
    // Zod error
    else if(err.name === "ZodError"){

        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TerrorSources[];
    }

    // Mongoose validation error
    else if(err.name === "ValidationError"){

        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TerrorSources[];
    }
    
    else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }else if (err instanceof Error){
        statusCode = 500
        message =  err.message
    }

    res.status(500).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development"? err : null,
        stack: envVars.NODE_ENV === "development"? err.stack : null                                                                                                                                                                                                                                                                                                                                                                                                             
    });
}