import { AppError } from '../../shared/errors/app-error.js';
import { hashPassword, verifyPassword } from '../../shared/security/password.js';
import { signToken } from '../../shared/security/token.js';

const administracaoSummary = {
  entities: [
    'usuarios',
    'perfis_acesso',
    'permissoes',
    'usuario_perfis',
    'perfil_permissoes',
    'filiais',
    'aeroportos',
    'cargos',
    'funcoes_operacionais',
    'tipos_jornada',
    'escalas_modelo',
  ],
};

const normalizeStatus = (status) => status || 'ativo';

const validateRequiredFields = (payload, fields) => {
  const missingFields = fields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new AppError('Campos obrigatorios ausentes.', 400, {
      missingFields,
    });
  }
};

const validateUserPayload = async (payload, mode = 'create') => {
  validateRequiredFields(payload, ['nome', 'email', 'login']);

  if (mode === 'create' && !payload.senha) {
    throw new AppError('O campo senha e obrigatorio.', 400);
  }

  return {
    nome: payload.nome,
    email: payload.email,
    login: payload.login,
    senhaHash: payload.senha ? await hashPassword(payload.senha) : null,
    status: normalizeStatus(payload.status),
  };
};

const validateProfilePayload = (payload) => {
  validateRequiredFields(payload, ['nome']);

  return {
    nome: payload.nome,
    descricao: payload.descricao ?? null,
    status: normalizeStatus(payload.status),
  };
};

const validatePermissionPayload = (payload) => {
  validateRequiredFields(payload, ['modulo', 'acao']);

  return {
    modulo: payload.modulo,
    acao: payload.acao,
    descricao: payload.descricao ?? null,
    status: normalizeStatus(payload.status),
  };
};

const validateUserProfilePayload = (payload) => {
  validateRequiredFields(payload, ['perfilId']);

  return {
    perfilId: Number(payload.perfilId),
    filialId: payload.filialId ? Number(payload.filialId) : null,
  };
};

const validateProfilePermissionPayload = (payload) => {
  validateRequiredFields(payload, ['permissaoId']);

  return {
    permissaoId: Number(payload.permissaoId),
  };
};

export const createAdministracaoService = ({
  userRepository,
  profileRepository,
  permissionRepository,
  userProfileRepository,
  profilePermissionRepository,
  env,
}) => ({
  getOverview() {
    return {
      module: 'administracao',
      ...administracaoSummary,
    };
  },

  async login(payload) {
    validateRequiredFields(payload, ['login', 'senha']);
    const user = await userRepository.findAuthByLogin(payload.login);

    if (!user || user.status !== 'ativo') {
      throw new AppError('Credenciais invalidas.', 401);
    }

    const validPassword = await verifyPassword(payload.senha, user.senha_hash);

    if (!validPassword) {
      throw new AppError('Credenciais invalidas.', 401);
    }

    const profiles = await userProfileRepository.findByUserId(user.id);
    await userRepository.touchLastAccess(user.id);

    return {
      token: signToken(
        {
          sub: user.id,
          login: user.login,
          perfis: profiles.map((profile) => profile.perfil_nome),
        },
        env.appName,
      ),
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        login: user.login,
      },
      perfis: profiles,
    };
  },

  async listUsers() {
    return userRepository.findAll();
  },

  async getUserById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    return user;
  },

  async createUser(payload, actorId) {
    const input = await validateUserPayload(payload, 'create');
    return userRepository.create(input, actorId);
  },

  async updateUser(id, payload, actorId) {
    const input = await validateUserPayload(payload, 'update');
    const user = await userRepository.update(id, input, actorId);

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    return user;
  },

  async deleteUser(id, actorId) {
    const user = await userRepository.softDelete(id, actorId);

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    return user;
  },

  async listProfiles() {
    return profileRepository.findAll();
  },

  async getProfileById(id) {
    const profile = await profileRepository.findById(id);

    if (!profile) {
      throw new AppError('Perfil nao encontrado.', 404);
    }

    return profile;
  },

  async createProfile(payload, actorId) {
    return profileRepository.create(validateProfilePayload(payload), actorId);
  },

  async updateProfile(id, payload, actorId) {
    const profile = await profileRepository.update(id, validateProfilePayload(payload), actorId);

    if (!profile) {
      throw new AppError('Perfil nao encontrado.', 404);
    }

    return profile;
  },

  async deleteProfile(id, actorId) {
    const profile = await profileRepository.softDelete(id, actorId);

    if (!profile) {
      throw new AppError('Perfil nao encontrado.', 404);
    }

    return profile;
  },

  async listPermissions() {
    return permissionRepository.findAll();
  },

  async getPermissionById(id) {
    const permission = await permissionRepository.findById(id);

    if (!permission) {
      throw new AppError('Permissao nao encontrada.', 404);
    }

    return permission;
  },

  async createPermission(payload, actorId) {
    return permissionRepository.create(validatePermissionPayload(payload), actorId);
  },

  async updatePermission(id, payload, actorId) {
    const permission = await permissionRepository.update(id, validatePermissionPayload(payload), actorId);

    if (!permission) {
      throw new AppError('Permissao nao encontrada.', 404);
    }

    return permission;
  },

  async deletePermission(id, actorId) {
    const permission = await permissionRepository.softDelete(id, actorId);

    if (!permission) {
      throw new AppError('Permissao nao encontrada.', 404);
    }

    return permission;
  },

  async listUserProfiles(userId) {
    await this.getUserById(userId);
    return userProfileRepository.findByUserId(userId);
  },

  async assignProfileToUser(userId, payload, actorId) {
    await this.getUserById(userId);
    const assignment = validateUserProfilePayload(payload);
    await this.getProfileById(assignment.perfilId);

    return userProfileRepository.create(
      {
        usuarioId: userId,
        perfilId: assignment.perfilId,
        filialId: assignment.filialId,
      },
      actorId,
    );
  },

  async unassignProfileFromUser(userId, assignmentId, actorId) {
    await this.getUserById(userId);
    const assignment = await userProfileRepository.softDelete(assignmentId, actorId);

    if (!assignment) {
      throw new AppError('Vinculo usuario-perfil nao encontrado.', 404);
    }

    if (assignment.usuario_id !== userId) {
      throw new AppError('O vinculo nao pertence ao usuario informado.', 400);
    }

    return assignment;
  },

  async listProfilePermissions(profileId) {
    await this.getProfileById(profileId);
    return profilePermissionRepository.findByProfileId(profileId);
  },

  async assignPermissionToProfile(profileId, payload, actorId) {
    await this.getProfileById(profileId);
    const assignment = validateProfilePermissionPayload(payload);
    await this.getPermissionById(assignment.permissaoId);

    return profilePermissionRepository.create(
      {
        perfilId: profileId,
        permissaoId: assignment.permissaoId,
      },
      actorId,
    );
  },

  async unassignPermissionFromProfile(profileId, assignmentId, actorId) {
    await this.getProfileById(profileId);
    const assignment = await profilePermissionRepository.softDelete(assignmentId, actorId);

    if (!assignment) {
      throw new AppError('Vinculo perfil-permissao nao encontrado.', 404);
    }

    if (assignment.perfil_id !== profileId) {
      throw new AppError('O vinculo nao pertence ao perfil informado.', 400);
    }

    return assignment;
  },
});
