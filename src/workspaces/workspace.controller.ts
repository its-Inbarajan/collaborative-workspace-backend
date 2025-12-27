import { NextFunction, Request, Response } from "express";
import { createProjectSchema, createWorkspaceSchema, inviteCollaboratorSchema, updateMemberRoleSchema } from "./workspace.schema";
import { CustomError } from "../common/error.handler";
import { createProjectsService, createWorkspaceService, getUserWorkspacesService, inviteCollaboratorService, removeCollaboratorService, updateMemberRoleService } from "./workspace.service";

interface User {
    id: string,
    role: string
}

interface AuthenticatedRequest extends Request {
    user: User;
}

export async function createWorkSpace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const parsed = createWorkspaceSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new CustomError('Invalid request data', 400)
        }
        const authenticateUser = req as AuthenticatedRequest
        const userId = authenticateUser.user?.id;
        const workspace = await createWorkspaceService(
            parsed.data.name,
            userId
        )

        res.status(201).json(workspace)
    } catch (error: unknown) {
        next(error)
    }
}

export async function getUserWorkspaces(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req as AuthenticatedRequest;

        const workspaces = await getUserWorkspacesService(user.user.id);
        res.status(200).json(workspaces)
    } catch (error: unknown) {
        next(error)
    }
}

export async function inviteCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = inviteCollaboratorSchema.safeParse(req.body);

        if (!parsed.success) {
            throw new CustomError('Invalid request data', 400)
        }

        const { workspaceId } = req.params

        await inviteCollaboratorService(
            workspaceId,
            parsed.data.email,
            parsed.data.role
        )
        res.status(200).json({ message: "Invited successfully", success: true })
    } catch (error: unknown) {
        next(error)
    }
}

export async function updateMemberRole(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = updateMemberRoleSchema.safeParse(req.body);

        if (!parsed.success) {
            throw new CustomError('Invalid request data', 400)
        }

        const { workspaceId, userId } = req.params
        const requesterId = (req as AuthenticatedRequest).user.id

        await updateMemberRoleService(
            workspaceId,
            requesterId,
            userId,
            parsed.data.role
        );

        res.status(200).json({ success: true, message: `member updated to ${parsed.data.role}` });
    } catch (error) {
        next(error)
    }
}

export async function removeCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
        const { workspaceId, userId } = req.params;
        const requesterId = (req as AuthenticatedRequest).user.id

        await removeCollaboratorService(
            workspaceId,
            requesterId,
            userId
        )
        res.status(200).json({ message: 'Collaborator removed from workspace.' });
    } catch (error: unknown) {
        next(error)
    }
}

export async function createProjects(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = createProjectSchema.safeParse(req.body);

        if (!parsed.success) {
            throw new CustomError('Invalid request data', 400);
        }

        const { workspaceId } = req.params
        const authenticateUserId = (req as AuthenticatedRequest).user.id;
        const project = await createProjectsService(
            workspaceId,
            authenticateUserId,
            parsed.data.name,
            parsed.data.description
        )

        res.status(201).json({ message: "Project created sucessfully", project })
    } catch (error: unknown) {
        next(error)
    }
}