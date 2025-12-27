import { NextFunction, Request, Response } from "express";
import { deleteProjectService, listProjectsService, updateProjectService } from "./project.service";
import { updateProjectSchema } from "./project.schema";
import { CustomError } from "../common/error.handler";

export async function listProjects(req: Request, res: Response, next: NextFunction) {
    try {
        const { workspaceId } = req.params;
        const project = await listProjectsService(workspaceId);

        res.status(200).json({
            status: true,
            data: project
        })
    } catch (error: unknown) {
        next(error)
    }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = updateProjectSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new CustomError('Invalid request data', 400);
        }

        const { projectId } = req.params;

        const project = await updateProjectService(
            projectId,
            parsed.data.name,
            parsed.data.description
        );

        res.status(200).json(project);
    } catch (error: unknown) {
        next(error)
    }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params;

        const response = await deleteProjectService(projectId);

        res.status(200).json({
            message: "project deleted successfully",
            data: response
        })
    } catch (error: unknown) {
        next(error)
    }
}