import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { createProjects, createWorkSpace, getUserWorkspaces, inviteCollaborator, removeCollaborator, updateMemberRole } from './workspace.controller';
import { requireWorkspaceRole } from './workspace.middleware';
import { Role } from '../@types/auth.types';

const workspaceRouter = Router();

workspaceRouter.post('/', authenticate, createWorkSpace)
workspaceRouter.post('/:workspaceId/projects', authenticate, requireWorkspaceRole(Role.COLLABORATOR), createProjects)
workspaceRouter.get('/getUserWorkspaces', authenticate, getUserWorkspaces)
workspaceRouter.post('/:workspaceId/invite', authenticate,
    requireWorkspaceRole(Role.OWNER),
    inviteCollaborator
)
workspaceRouter.patch(
    '/:workspaceId/members/:userId', authenticate,
    requireWorkspaceRole(Role.OWNER),
    updateMemberRole
)
workspaceRouter.delete(
    '/:workspaceId/members/:userId',
    authenticate,
    requireWorkspaceRole(Role.OWNER),
    removeCollaborator
)

export default workspaceRouter