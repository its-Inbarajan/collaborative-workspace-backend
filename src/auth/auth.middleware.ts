import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../@types/auth.types";
import { CustomError } from "../common/error.handler";
import jwt from 'jsonwebtoken';
import { EnvConfig } from "../config/env";


export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return next(new CustomError('Missing token', 401))
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(
            token,
            EnvConfig.JWT_ACCESS_SECRET!
        ) as JwtPayload

        req.user = {
            id: payload.id,
            role: payload.role
        }

        next()
    } catch (error: unknown) {
        next(error)
    }
}