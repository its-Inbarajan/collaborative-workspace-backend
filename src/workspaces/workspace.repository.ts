import { Role } from "../@types/auth.types";
import { pool } from "../common/db";
import { CustomError } from "../common/error.handler";

export async function createWorkspaceRepo(name: string, createdBy: string) {
    const workspaceResult = await pool.query(
        `
        INSERT INTO workspaces (name, created_by)
        VALUES ($1, $2)
        RETURNING id, name
        `,
        [name, createdBy]
    )
    const workspace = workspaceResult.rows[0];

    await pool.query(
        `
        INSERT INTO workspace_members (workspace_id, user_id, role)
        VALUES ($1, $2, $3)
        `,
        [workspace.id, createdBy, Role.OWNER]
    )
    return workspace;
}

export async function getUserWorkspacesRepo(userId: string) {
    const result = await pool.query(
        `
        SELECT
        w.id,
        w.name,
        wm.role
        FROM workspace_members wm
        JOIN workspaces w ON w.id = wm.workspace_id
        WHERE wm.user_id = $1
        ORDER BY w.created_at DESC
        `,
        [userId]
    )
    return result.rows
}

export async function inviteCollaboratorRepo(workspaceId: string, email: string, role: Role) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');
        const invitedUser = await client.query(
            `
            SELECT id FROM users WHERE email = $1
            `,
            [email]
        );

        if (!invitedUser.rows.length) {
            throw new CustomError('User not found', 404);
        }

        const userId = invitedUser.rows[0].id;

        // Adding him to workspace
        await client.query(
            `
            INSERT INTO workspace_members (workspace_id, user_id, role)
            VALUES ($1, $2, $3)
            ON CONFLICT (workspace_id, user_id) DO NOTHING
            `,
            [workspaceId, userId, role]
        )
        await client.query('COMMIT');
    } catch (error: unknown) {
        await client.query('ROLLBACK');
        throw error
    } finally {
        client.release()
    }
}

export async function updateMemberRoleRepo(workspaceId: string, targetUserId: string, role: Role) {
    const result = await pool.query(
        `
        UPDATE workspace_members
        SET role = $1
        WHERE workspace_id = $2 AND user_id = $3
        `,
        [role, workspaceId, targetUserId]
    );
    if (result.rowCount === 0) {
        throw new CustomError('Member not found', 404);
    }
}

export async function removeCollaboratorRepo(workspaceId: string, targetUserId: string) {
    const result = await pool.query(
        `
        DELETE FROM workspace_members
        WHERE workspace_id = $1 AND user_id = $2
        `,
        [workspaceId, targetUserId]
    )

    if (result.rowCount === 0) {
        throw new CustomError('Member not found', 404)
    }
}

export async function createProjectRepo(workspaceId: string, name: string, description: string | undefined, createdBy: string) {
    const result = await pool.query(
        `
        INSERT INTO projects (workspace_id, name, description, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, description
        `,
        [workspaceId, name, description, createdBy]
    );

    return result.rows[0]
}