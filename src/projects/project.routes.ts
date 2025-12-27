import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { requireWorkspaceRole } from '../workspaces/workspace.middleware';
import { Role } from '../@types/auth.types';
import { deleteProject, listProjects, updateProject } from './project.controller';

const projectRouter = Router();

projectRouter.get(
    '/:workspaceId/projects',
    authenticate,
    requireWorkspaceRole(Role.VIEWER),
    listProjects
);

projectRouter.patch(
    'projects/:projectId',
    authenticate,
    requireWorkspaceRole(Role.COLLABORATOR),
    updateProject
)


projectRouter.delete(
    'projects/:projectId',
    authenticate,
    requireWorkspaceRole(Role.OWNER),
    deleteProject
)

export default projectRouter