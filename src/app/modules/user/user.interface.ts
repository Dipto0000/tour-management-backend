import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "Super Admin",
    ADMIN = "Admin",
    USER = "User",
    GUIDE= "Guide"
};

export interface IAuthProvider{
    provider: "google"| "credentials";
    providerId: string;
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"

}
export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password ?: string;
    phone ?: string;
    pictures ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: IsActive;
    isVerified ?: boolean;
    role: Role;
    auths?: IAuthProvider[],
    bookings?: Types.ObjectId[],
    guides?: Types.ObjectId[]



}