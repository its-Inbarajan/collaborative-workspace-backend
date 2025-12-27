import { Role } from "../@types/auth.types";
import { CustomError } from "../common/error.handler";
import { createProjectRepo, createWorkspaceRepo, getUserWorkspacesRepo, inviteCollaboratorRepo, removeCollaboratorRepo, updateMemberRoleRepo } from "./workspace.repository";

export async function createWorkspaceService(
    name: string,
    userId: string
) {
    // futures logics will be here
    return createWorkspaceRepo(name, userId);
}

export async function getUserWorkspacesService(userId: string) {
    return getUserWorkspacesRepo(userId)
}

export async function inviteCollaboratorService(workspaceId: string, email: string, role: Role) {
    return inviteCollaboratorRepo(workspaceId, email, role)
}

export async function updateMemberRoleService(
    workspaceId: string,
    requesterId: string,
    targetUserId: string,
    role: Role
) {
    if (requesterId === targetUserId) {
        throw new CustomError('Owner cannot change own role', 400);
    }

    return updateMemberRoleRepo(workspaceId, targetUserId, role);
}

export async function removeCollaboratorService(workspaceId: string, requesterId: string, targetUserId: string) {
    if (requesterId === targetUserId) {
        throw new CustomError('Owner cannot remove self', 400)
    }

    return removeCollaboratorRepo(workspaceId, requesterId)
}

export async function createProjectsService(workspaceId: string, userId: string, name: string, description?: string) {
    return createProjectRepo(workspaceId, name, description, userId)
}