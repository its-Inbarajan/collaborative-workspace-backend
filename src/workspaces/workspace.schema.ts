import z from 'zod';
import { Role } from '../@types/auth.types';

export const createWorkspaceSchema = z.object({
    name: z.string().min(3, 'Workspace name is too short')
})

export const inviteCollaboratorSchema = z.object({
    email: z.email(),
    role: z.enum(Role),
});

export const updateMemberRoleSchema = z.object({
    role: z.enum(Role),
});

export const createProjectSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
});