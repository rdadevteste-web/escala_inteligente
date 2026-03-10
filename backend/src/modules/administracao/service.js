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
  return { nome: payload.nome, descricao: payload.descricao ?? null, status: normalizeStatus(payload.status) };
};

const validatePermissionPayload = (payload) => {
  validateRequiredFields(payload, ['modulo', 'acao']);
  return { modulo: payload.modulo, acao: payload.acao, descricao: payload.descricao ?? null, status: normalizeStatus(payload.status) };
};

const validateUserProfilePayload = (payload) => {
  validateRequiredFields(payload, ['perfilId']);
  return { perfilId: Number(payload.perfilId), filialId: payload.filialId ? Number(payload.filialId) : null };
};

const validateProfilePermissionPayload = (payload) => {
  validateRequiredFields(payload, ['permissaoId']);
  return { permissaoId: Number(payload.permissaoId) };
};

const validateAirportPayload = (payload) => {
  validateRequiredFields(payload, ['nome', 'cidade', 'estado', 'pais']);
  return {
    nome: payload.nome,
    codigoIata: payload.codigoIata ?? null,
    codigoIcao: payload.codigoIcao ?? null,
    cidade: payload.cidade,
    estado: payload.estado,
    pais: payload.pais,
    status: normalizeStatus(payload.status),
  };
};

const validateBranchPayload = (payload) => {
  validateRequiredFields(payload, ['empresaId', 'nome']);
  return {
    empresaId: Number(payload.empresaId),
    aeroportoId: payload.aeroportoId ? Number(payload.aeroportoId) : null,
    nome: payload.nome,
    sigla: payload.sigla ?? null,
    cnpj: payload.cnpj ?? null,
    telefone: payload.telefone ?? null,
    email: payload.email ?? null,
    status: normalizeStatus(payload.status),
  };
};

const validatePositionPayload = (payload) => {
  validateRequiredFields(payload, ['nome']);
  return {
    nome: payload.nome,
    descricao: payload.descricao ?? null,
    nivel: payload.nivel ?? null,
    status: normalizeStatus(payload.status),
  };
};

export const createAdministracaoService = ({
  userRepository,
  profileRepository,
  permissionRepository,
  userProfileRepository,
  profilePermissionRepository,
  airportRepository,
  branchRepository,
  positionRepository,
  env,
}) => ({
  getOverview() {
    return { module: 'administracao', ...administracaoSummary };
  },
  async login(payload) {
    validateRequiredFields(payload, ['login', 'senha']);
    const user = await userRepository.findAuthByLogin(payload.login);
    if (!user || user.status !== 'ativo') throw new AppError('Credenciais invalidas.', 401);
    const validPassword = await verifyPassword(payload.senha, user.senha_hash);
    if (!validPassword) throw new AppError('Credenciais invalidas.', 401);
    const profiles = await userProfileRepository.findByUserId(user.id);
    const permissions = await userProfileRepository.findPermissionKeysByUserId(user.id);
    await userRepository.touchLastAccess(user.id);
    return {
      token: signToken({ sub: user.id, login: user.login, perfis: profiles.map((profile) => profile.perfil_nome), permissoes: permissions }, env.authTokenSecret),
      usuario: { id: user.id, nome: user.nome, email: user.email, login: user.login },
      perfis: profiles,
      permissoes: permissions,
    };
  },
  async listUsers() { return userRepository.findAll(); },
  async getUserById(id) { const item = await userRepository.findById(id); if (!item) throw new AppError('Usuario nao encontrado.', 404); return item; },
  async createUser(payload, actorId) { return userRepository.create(await validateUserPayload(payload, 'create'), actorId); },
  async updateUser(id, payload, actorId) { const item = await userRepository.update(id, await validateUserPayload(payload, 'update'), actorId); if (!item) throw new AppError('Usuario nao encontrado.', 404); return item; },
  async deleteUser(id, actorId) { const item = await userRepository.softDelete(id, actorId); if (!item) throw new AppError('Usuario nao encontrado.', 404); return item; },
  async listProfiles() { return profileRepository.findAll(); },
  async getProfileById(id) { const item = await profileRepository.findById(id); if (!item) throw new AppError('Perfil nao encontrado.', 404); return item; },
  async createProfile(payload, actorId) { return profileRepository.create(validateProfilePayload(payload), actorId); },
  async updateProfile(id, payload, actorId) { const item = await profileRepository.update(id, validateProfilePayload(payload), actorId); if (!item) throw new AppError('Perfil nao encontrado.', 404); return item; },
  async deleteProfile(id, actorId) { const item = await profileRepository.softDelete(id, actorId); if (!item) throw new AppError('Perfil nao encontrado.', 404); return item; },
  async listPermissions() { return permissionRepository.findAll(); },
  async getPermissionById(id) { const item = await permissionRepository.findById(id); if (!item) throw new AppError('Permissao nao encontrada.', 404); return item; },
  async createPermission(payload, actorId) { return permissionRepository.create(validatePermissionPayload(payload), actorId); },
  async updatePermission(id, payload, actorId) { const item = await permissionRepository.update(id, validatePermissionPayload(payload), actorId); if (!item) throw new AppError('Permissao nao encontrada.', 404); return item; },
  async deletePermission(id, actorId) { const item = await permissionRepository.softDelete(id, actorId); if (!item) throw new AppError('Permissao nao encontrada.', 404); return item; },
  async listUserProfiles(userId) { await this.getUserById(userId); return userProfileRepository.findByUserId(userId); },
  async assignProfileToUser(userId, payload, actorId) { await this.getUserById(userId); const assignment = validateUserProfilePayload(payload); await this.getProfileById(assignment.perfilId); return userProfileRepository.create({ usuarioId: userId, perfilId: assignment.perfilId, filialId: assignment.filialId }, actorId); },
  async unassignProfileFromUser(userId, assignmentId, actorId) { await this.getUserById(userId); const item = await userProfileRepository.softDelete(assignmentId, actorId); if (!item) throw new AppError('Vinculo usuario-perfil nao encontrado.', 404); if (item.usuario_id !== userId) throw new AppError('O vinculo nao pertence ao usuario informado.', 400); return item; },
  async listProfilePermissions(profileId) { await this.getProfileById(profileId); return profilePermissionRepository.findByProfileId(profileId); },
  async assignPermissionToProfile(profileId, payload, actorId) { await this.getProfileById(profileId); const assignment = validateProfilePermissionPayload(payload); await this.getPermissionById(assignment.permissaoId); return profilePermissionRepository.create({ perfilId: profileId, permissaoId: assignment.permissaoId }, actorId); },
  async unassignPermissionFromProfile(profileId, assignmentId, actorId) { await this.getProfileById(profileId); const item = await profilePermissionRepository.softDelete(assignmentId, actorId); if (!item) throw new AppError('Vinculo perfil-permissao nao encontrado.', 404); if (item.perfil_id !== profileId) throw new AppError('O vinculo nao pertence ao perfil informado.', 400); return item; },
  async listAirports() { return airportRepository.findAll(); },
  async getAirportById(id) { const item = await airportRepository.findById(id); if (!item) throw new AppError('Aeroporto nao encontrado.', 404); return item; },
  async createAirport(payload, actorId) { return airportRepository.create(validateAirportPayload(payload), actorId); },
  async updateAirport(id, payload, actorId) { const item = await airportRepository.update(id, validateAirportPayload(payload), actorId); if (!item) throw new AppError('Aeroporto nao encontrado.', 404); return item; },
  async deleteAirport(id, actorId) { const item = await airportRepository.softDelete(id, actorId); if (!item) throw new AppError('Aeroporto nao encontrado.', 404); return item; },
  async listBranches() { return branchRepository.findAll(); },
  async getBranchById(id) { const item = await branchRepository.findById(id); if (!item) throw new AppError('Filial nao encontrada.', 404); return item; },
  async createBranch(payload, actorId) { return branchRepository.create(validateBranchPayload(payload), actorId); },
  async updateBranch(id, payload, actorId) { const item = await branchRepository.update(id, validateBranchPayload(payload), actorId); if (!item) throw new AppError('Filial nao encontrada.', 404); return item; },
  async deleteBranch(id, actorId) { const item = await branchRepository.softDelete(id, actorId); if (!item) throw new AppError('Filial nao encontrada.', 404); return item; },
  async listPositions() { return positionRepository.findAll(); },
  async getPositionById(id) { const item = await positionRepository.findById(id); if (!item) throw new AppError('Cargo nao encontrado.', 404); return item; },
  async createPosition(payload, actorId) { return positionRepository.create(validatePositionPayload(payload), actorId); },
  async updatePosition(id, payload, actorId) { const item = await positionRepository.update(id, validatePositionPayload(payload), actorId); if (!item) throw new AppError('Cargo nao encontrado.', 404); return item; },
  async deletePosition(id, actorId) { const item = await positionRepository.softDelete(id, actorId); if (!item) throw new AppError('Cargo nao encontrado.', 404); return item; },
});
