import { NextFunction, Request, Response } from "express";
import { userAuthSchema } from "./auth.schema";
import * as authService from './auth.service';
import { CustomError } from "../common/error.handler";

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parsed = userAuthSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new CustomError('Invalid request data', 400);
        }
        const input = parsed.data

        const result = await authService.register(
            input.email,
            input.password
        );

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = userAuthSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new CustomError('Invalid request data', 400);
        }

        const result = await authService.login(
            parsed.data.email,
            parsed.data.password
        )

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error: unknown) {
        next(error)
    }
}

export async function me(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;

        const user = await authService.getMe(userId);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: unknown) {
        next(error)
    }
}