import AppError from "../../errorHelpers/appError";
// import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptJs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";


// const credentialsLogin = async (payload: Partial<IUser>) =>{
//     const {email, password} = payload;

//      const isUserExist = await User.findOne({email})

//     if (!isUserExist){
//         throw new AppError (httpStatus.BAD_REQUEST, "User does not exist");
//     }

//     const isPasswordMatch = await bcryptJs.compare(password as string, isUserExist.password as string);

//     if(!isPasswordMatch){
//         throw new AppError (httpStatus.BAD_REQUEST,"Incorrect Password")
//     }

//     const userTokens = createUserTokens(isUserExist)

//     // delete isUserExist.toObject().password;

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const {password: pass, ...rest} = isUserExist.toObject();


//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest,
//     }


// }

const getNewAccessToken = async (refreshToken: string) =>{

   const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

   return {
    accessToken: newAccessToken
   }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) =>{

    const user = await User.findById(decodedToken.userId)

    const isOldPassword = await bcryptJs.compare(oldPassword, user!.password as string)

    if(!isOldPassword){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
    }

    user!.password = await bcryptJs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();

}

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
}