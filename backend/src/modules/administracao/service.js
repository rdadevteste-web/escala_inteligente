import { AppError } from '../../shared/errors/app-error.js';

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

const validateUserPayload = (payload, mode = 'create') => {
  const requiredFields = ['nome', 'email', 'login'];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new AppError('Campos obrigatorios ausentes.', 400, {
      missingFields,
    });
  }

  if (mode === 'create' && !payload.senha) {
    throw new AppError('O campo senha e obrigatorio.', 400);
  }

  return {
    nome: payload.nome,
    email: payload.email,
    login: payload.login,
    senhaHash: payload.senha ?? 'definir-senha-segura',
    status: normalizeStatus(payload.status),
  };
};

export const createAdministracaoService = ({ userRepository }) => ({
  getOverview() {
    return {
      module: 'administracao',
      ...administracaoSummary,
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
    const input = validateUserPayload(payload, 'create');
    return userRepository.create(input, actorId);
  },

  async updateUser(id, payload, actorId) {
    const input = validateUserPayload(payload, 'update');
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
});
