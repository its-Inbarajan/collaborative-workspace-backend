import z from "zod";

export const joinWorkspaceSchema = z.object({
    workspaceId: z.uuid(),
});

export const leaveWorkspaceSchema = joinWorkspaceSchema;

export const fileChangeSchema = z.object({
    workspaceId: z.string().uuid(),
    projectId: z.string().uuid(),
    payload: z.unknown(),
});

export const cursorSchema = z.object({
    workspaceId: z.string().uuid(),
    x: z.number(),
    y: z.number(),
});
