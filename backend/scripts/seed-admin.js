import { env } from '../src/shared/config/env.js';
import { createPostgresPool } from '../src/shared/database/postgres.js';
import { logger } from '../src/shared/logger/logger.js';
import { hashPassword } from '../src/shared/security/password.js';

const ADMIN_PERMISSIONS = [
  'administracao:gerenciar_usuarios',
  'administracao:gerenciar_perfis',
  'administracao:gerenciar_permissoes',
  'administracao:gerenciar_aeroportos',
  'administracao:gerenciar_filiais',
  'administracao:gerenciar_cargos',
];

const adminSeed = {
  nome: process.env.ADMIN_SEED_NAME || 'Administrador do Sistema',
  email: process.env.ADMIN_SEED_EMAIL || 'admin@erp-aeroportuario.local',
  login: process.env.ADMIN_SEED_LOGIN || 'admin',
  senha: process.env.ADMIN_SEED_PASSWORD || 'Admin@123',
  perfil: process.env.ADMIN_SEED_PROFILE || 'Administrador',
};

const parsePermission = (permissionKey) => {
  const [modulo, acao] = permissionKey.split(':');
  return {
    modulo,
    acao,
    descricao: `Permite ${acao} no modulo ${modulo}`,
  };
};

const main = async () => {
  const database = createPostgresPool(env, logger);
  const senhaHash = await hashPassword(adminSeed.senha);

  try {
    await database.withUserContext(null, async (client) => {
      await client.query('BEGIN');

      const userResult = await client.query(
        `SELECT id FROM usuarios WHERE login = $1 AND deleted_at IS NULL`,
        [adminSeed.login],
      );

      let adminUserId;

      if (userResult.rows[0]) {
        adminUserId = userResult.rows[0].id;
        await client.query(
          `UPDATE usuarios
           SET nome = $2,
               email = $3,
               senha_hash = $4,
               status = 'ativo',
               updated_at = NOW()
           WHERE id = $1`,
          [adminUserId, adminSeed.nome, adminSeed.email, senhaHash],
        );
      } else {
        const insertedUser = await client.query(
          `INSERT INTO usuarios (nome, email, login, senha_hash, status)
           VALUES ($1, $2, $3, $4, 'ativo')
           RETURNING id`,
          [adminSeed.nome, adminSeed.email, adminSeed.login, senhaHash],
        );
        adminUserId = insertedUser.rows[0].id;
        await client.query(
          `UPDATE usuarios
           SET created_by = $1,
               updated_by = $1
           WHERE id = $1`,
          [adminUserId],
        );
      }

      const profileResult = await client.query(
        `SELECT id FROM perfis_acesso WHERE nome = $1 AND deleted_at IS NULL`,
        [adminSeed.perfil],
      );

      let adminProfileId;

      if (profileResult.rows[0]) {
        adminProfileId = profileResult.rows[0].id;
        await client.query(
          `UPDATE perfis_acesso
           SET descricao = $2,
               status = 'ativo',
               updated_by = $3,
               updated_at = NOW()
           WHERE id = $1`,
          [adminProfileId, 'Perfil bootstrap com acesso administrativo total.', adminUserId],
        );
      } else {
        const insertedProfile = await client.query(
          `INSERT INTO perfis_acesso (nome, descricao, created_by, updated_by, status)
           VALUES ($1, $2, $3, $3, 'ativo')
           RETURNING id`,
          [adminSeed.perfil, 'Perfil bootstrap com acesso administrativo total.', adminUserId],
        );
        adminProfileId = insertedProfile.rows[0].id;
      }

      for (const permissionKey of ADMIN_PERMISSIONS) {
        const permission = parsePermission(permissionKey);
        const permissionResult = await client.query(
          `SELECT id FROM permissoes
           WHERE modulo = $1 AND acao = $2 AND deleted_at IS NULL`,
          [permission.modulo, permission.acao],
        );

        let permissionId;

        if (permissionResult.rows[0]) {
          permissionId = permissionResult.rows[0].id;
          await client.query(
            `UPDATE permissoes
             SET descricao = $2,
                 status = 'ativo',
                 updated_by = $3,
                 updated_at = NOW()
             WHERE id = $1`,
            [permissionId, permission.descricao, adminUserId],
          );
        } else {
          const insertedPermission = await client.query(
            `INSERT INTO permissoes (modulo, acao, descricao, created_by, updated_by, status)
             VALUES ($1, $2, $3, $4, $4, 'ativo')
             RETURNING id`,
            [permission.modulo, permission.acao, permission.descricao, adminUserId],
          );
          permissionId = insertedPermission.rows[0].id;
        }

        const profilePermissionResult = await client.query(
          `SELECT id FROM perfil_permissoes
           WHERE perfil_id = $1 AND permissao_id = $2 AND deleted_at IS NULL`,
          [adminProfileId, permissionId],
        );

        if (!profilePermissionResult.rows[0]) {
          await client.query(
            `INSERT INTO perfil_permissoes (perfil_id, permissao_id, created_by, updated_by, status)
             VALUES ($1, $2, $3, $3, 'ativo')`,
            [adminProfileId, permissionId, adminUserId],
          );
        }
      }

      const userProfileResult = await client.query(
        `SELECT id FROM usuario_perfis
         WHERE usuario_id = $1 AND perfil_id = $2 AND deleted_at IS NULL`,
        [adminUserId, adminProfileId],
      );

      if (!userProfileResult.rows[0]) {
        await client.query(
          `INSERT INTO usuario_perfis (usuario_id, perfil_id, created_by, updated_by, status)
           VALUES ($1, $2, $3, $3, 'ativo')`,
          [adminUserId, adminProfileId, adminUserId],
        );
      }

      await client.query('COMMIT');

      logger.info('Admin bootstrap seed applied', {
        login: adminSeed.login,
        email: adminSeed.email,
        profile: adminSeed.perfil,
        permissions: ADMIN_PERMISSIONS.length,
      });
    });
  } catch (error) {
    logger.error('Admin bootstrap seed failed', {
      error: error.message,
      stack: error.stack,
    });
    process.exitCode = 1;
  } finally {
    await database.close();
  }
};

main();
