import { NextFunction, Request, Response } from "express"
import { Role } from "../@types/auth.types"
import { pool } from "../common/db";
import { CustomError } from "../common/error.handler";
interface User {
    id: string,
    role: string
}

interface AuthenticatedRequest extends Request {
    user: User;
}

const ROLE_PRIORITY: Record<Role, number> = {
    [Role.OWNER]: 3,
    [Role.COLLABORATOR]: 2,
    [Role.VIEWER]: 1,
};

export const requireWorkspaceRole = (minRole: Role) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const { workspaceId } = req.params;
        const authUser = (req as AuthenticatedRequest).user

        const result = await pool.query(
            `
            SELECT role
            FROM workspace_members
            WHERE workspace_id = $1 AND user_id = $2
            `,
            [workspaceId, authUser.id]
        )

        if (!result.rows.length) {
            throw new CustomError('Forbidden', 403);
        }

        const userRole = result.rows[0].role as Role;

        if (ROLE_PRIORITY[userRole] < ROLE_PRIORITY[minRole]) {
            throw new CustomError('Forbidden', 403);
        }

        next();
    } catch (error: unknown) {
        next(error)
    }
}