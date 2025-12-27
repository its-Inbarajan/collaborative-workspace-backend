import { deleteProjectRepo, listProjectsRepo, updateProjectRepo } from "./project.repository";

export async function listProjectsService(workspaceId: string) {
    return listProjectsRepo(workspaceId);
}


export async function updateProjectService(projectId: string, name?: string, description?: string) {
    return updateProjectRepo(projectId, name, description)
}

export async function deleteProjectService(projectId: string) {
    return deleteProjectRepo(projectId)
}