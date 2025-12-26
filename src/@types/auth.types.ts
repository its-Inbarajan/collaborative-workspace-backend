import { Request } from "express";

export enum Role {
    OWNER = 'owner',
    COLLABORATOR = "collaborator",
    VIEWER = "viewer"
}

export interface JwtPayload {
    id: string,
    role: Role
}

// export interface AuthRequest extends Request {
//     user?: {
//         id: string;
//         role: string;
//     };
// }