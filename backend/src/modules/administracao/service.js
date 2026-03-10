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

export const createAdministracaoService = () => ({
  getOverview() {
    return {
      module: 'administracao',
      ...administracaoSummary,
    };
  },
  listSeedUsers() {
    return [
      {
        id: 1,
        nome: 'Administrador do Sistema',
        email: 'admin@erp-aeroportuario.local',
        status: 'ativo',
      },
    ];
  },
});
