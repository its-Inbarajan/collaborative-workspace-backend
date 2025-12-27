import { pool } from "../common/db";
import { CustomError } from "../common/error.handler";

export async function listProjectsRepo(workspaceId: string) {
    const result = await pool.query(
        `
        SELECT id, name, description, created_by
        FROM projects
        WHERE workspace_id = $1
        ORDER BY created_at DESC
        `,
        [workspaceId]
    )
    return result.rows;
}

export async function updateProjectRepo(projectId: string, name?: string, description?: string) {
    const result = await pool.query(
        `
        UPDATE projects
        SET 
            name = COALESCE($1, name),
            description = COALESCE($1, description),
        WHERE id = $3
        RETURNING id, name, description
        `,
        [name ?? null, description ?? null, projectId]
    );

    if (!result.rows.length) {
        throw new CustomError('Project not found', 404);
    }

    return result.rows[0];
}

export async function deleteProjectRepo(projectId: string) {

    const findProject = await pool.query(
        `
        SELECT id FROM projects WHERE id = $1
        `,
        [projectId]
    )
    if (!findProject) {
        throw new CustomError('Project not found', 404)
    }
    const result = await pool.query(
        `
        DELETE projects
        WHERE id = $1
        `,
        [projectId]
    );

    if (result.rowCount === 0) {
        throw new CustomError('Project not found', 404);
    }
}