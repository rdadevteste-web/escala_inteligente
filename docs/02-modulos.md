# Lista de Modulos

## 1. Administracao

### Objetivo

Centralizar os cadastros estruturais e o controle administrativo do sistema.

### Escopo

* gestao de usuarios;
* perfis e permissoes;
* empresas e filiais;
* aeroportos;
* setores;
* cargos;
* funcoes operacionais;
* jornadas e escalas modelo;
* parametros gerais do sistema;
* feriados;
* motivos padronizados de ocorrencia.

### Tabelas sugeridas

* `empresas`
* `filiais`
* `aeroportos`
* `setores`
* `usuarios`
* `perfis_acesso`
* `permissoes`
* `usuario_perfis`
* `perfil_permissoes`
* `cargos`
* `funcoes_operacionais`
* `tipos_jornada`
* `escalas_modelo`
* `feriados`
* `motivos_ocorrencia`
* `parametros_sistema`

## 2. Comercial

### Objetivo

Controlar a base de clientes, contratos, precos e demandas comerciais ou operacionais extraordinarias.

### Escopo

* cadastro de clientes;
* contatos comerciais e operacionais;
* unidades do cliente;
* catalogo de servicos;
* tipos de equipamentos cobrados ou previstos;
* contratos;
* servicos do contrato;
* precos por vigencia;
* SLA;
* propostas comerciais;
* atendimentos emergenciais.

### Tabelas sugeridas

* `clientes`
* `clientes_contatos`
* `clientes_unidades`
* `servicos`
* `equipamentos_tipos`
* `contratos`
* `contrato_servicos`
* `contrato_equipamentos`
* `contrato_precos`
* `contrato_sla`
* `propostas_comerciais`
* `proposta_itens`
* `atendimentos_emergenciais`
* `atendimento_emergencial_itens`

## 3. Operacional

### Objetivo

Gerenciar a execucao dos servicos, a alocacao da mao de obra, postos de trabalho, turnos e escala inteligente.

### Escopo

* postos de trabalho;
* turnos operacionais;
* atendimentos planejados ou executados;
* alocacao de colaboradores;
* vinculo entre operacao e voos;
* publicacao de escala;
* itens da escala;
* regras de escala inteligente;
* disponibilidade e restricoes de colaboradores;
* ocorrencias operacionais.

### Tabelas sugeridas

* `postos_trabalho`
* `postos_funcoes`
* `turnos`
* `atendimentos`
* `atendimento_equipes`
* `atendimento_equipamentos`
* `voos`
* `voo_atendimentos`
* `alocacoes`
* `escala_publicada`
* `escala_itens`
* `regras_escala`
* `restricoes_colaborador`
* `disponibilidade_colaborador`
* `ocorrencias_operacionais`

## 4. RH

### Objetivo

Gerenciar os dados funcionais do colaborador que impactam a operacao e a conformidade da empresa.

### Escopo

* cadastro de colaboradores;
* documentos;
* funcoes habilitadas;
* treinamentos e vencimentos;
* ferias;
* afastamentos;
* banco de horas;
* jornadas atribuidas;
* ponto;
* uniformes e EPI;
* historico funcional.

### Tabelas sugeridas

* `colaboradores`
* `colaborador_documentos`
* `colaborador_funcoes`
* `treinamentos`
* `colaborador_treinamentos`
* `cliente_habilitacoes`
* `afastamentos`
* `ferias`
* `banco_horas`
* `jornadas_colaborador`
* `ponto_registros`
* `uniformes_epi_tipos`
* `colaborador_uniformes_epi`
* `historico_funcional`
