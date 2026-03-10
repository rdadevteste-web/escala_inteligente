# ERP de Servicos Aeroportuarios

## Objetivo

Este documento serve como base inicial para estruturar o ERP de prestacao de servicos aeroportuarios. O foco e organizar:

* os modulos do sistema;
* as tabelas principais de banco de dados;
* as regras de negocio iniciais;
* o padrao de campos de auditoria e logs.

A ideia e usar este material como referencia para acompanhar o que ja foi criado, o que ainda falta e como orientar o desenvolvimento com apoio do Codex e versionamento no GitHub.

## Recomendacao de MVP

### Administracao

* `usuarios`
* `perfis_acesso`
* `permissoes`
* `usuario_perfis`
* `perfil_permissoes`
* `filiais`
* `aeroportos`
* `cargos`
* `funcoes_operacionais`
* `tipos_jornada`
* `escalas_modelo`

### Comercial

* `clientes`
* `clientes_contatos`
* `servicos`
* `contratos`
* `contrato_servicos`
* `contrato_precos`
* `atendimentos_emergenciais`

### Operacional

* `postos_trabalho`
* `turnos`
* `atendimentos`
* `alocacoes`
* `escala_publicada`
* `escala_itens`
* `ocorrencias_operacionais`

### RH

* `colaboradores`
* `colaborador_funcoes`
* `treinamentos`
* `colaborador_treinamentos`
* `afastamentos`
* `ferias`
* `jornadas_colaborador`

### Auditoria

* `auditoria_logs`
* `sistema_logs`

## Proximos passos sugeridos

1. Validar os modulos e tabelas.
2. Separar o que e MVP e o que fica para a fase 2.
3. Transformar essas tabelas em um modelo logico.
4. Depois gerar as migrations do banco.
5. So entao comecar CRUDs e telas.
