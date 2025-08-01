/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


// const createUser = async (req: Request, res: Response, next: NextFunction) =>{
//     try {
       
//         const user = UserService.createUser(req.body);
//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             user
//         })
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//         next(err)
//     }
// }

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: user,
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User updated successfully",
        data: user,
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const result = await UserService.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All user retrieved successfully",
        data: result.data,
        meta: result.meta,
    })
})

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
}