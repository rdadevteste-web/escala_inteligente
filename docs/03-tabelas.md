# Lista de Tabelas por Modulo

## Administracao

### `empresas`

Cadastro da empresa principal.

Campos principais:

* id
* razao_social
* nome_fantasia
* cnpj
* telefone
* email
* status

### `filiais`

Cadastro das bases operacionais.

Campos principais:

* id
* empresa_id
* nome
* sigla
* cnpj
* aeroporto_id
* telefone
* email
* status

### `aeroportos`

Cadastro dos aeroportos atendidos.

Campos principais:

* id
* nome
* codigo_iata
* codigo_icao
* cidade
* estado
* pais
* status

### `setores`

Setores administrativos ou operacionais.

Campos principais:

* id
* filial_id
* nome
* descricao
* status

### `usuarios`

Usuarios que acessam o sistema.

Campos principais:

* id
* nome
* email
* login
* senha_hash
* status
* ultimo_acesso_em

### `perfis_acesso`

Perfis de acesso como administrador, supervisor, RH e comercial.

Campos principais:

* id
* nome
* descricao
* status

### `permissoes`

Permissoes detalhadas por modulo e acao.

Campos principais:

* id
* modulo
* acao
* descricao

### `usuario_perfis`

Relaciona usuarios e perfis.

Campos principais:

* id
* usuario_id
* perfil_id
* filial_id

### `perfil_permissoes`

Relaciona perfis e permissoes.

Campos principais:

* id
* perfil_id
* permissao_id

### `cargos`

Cargos formais da empresa.

Campos principais:

* id
* nome
* descricao
* nivel
* status

### `funcoes_operacionais`

Funcoes praticas exercidas na operacao.

Campos principais:

* id
* nome
* descricao
* requer_treinamento
* status

### `tipos_jornada`

Modelos de jornada contratual.

Campos principais:

* id
* nome
* descricao
* carga_horaria_semanal
* horas_dia_padrao
* escala_base
* status

### `escalas_modelo`

Modelos como 5x2, 6x1 e 12x36.

Campos principais:

* id
* nome
* descricao
* tipo_jornada_id
* quantidade_dias_trabalho
* quantidade_dias_folga
* status

### `feriados`

Cadastro de feriados nacionais, estaduais, municipais ou locais.

Campos principais:

* id
* data
* descricao
* abrangencia
* cidade
* estado

### `motivos_ocorrencia`

Padronizacao de motivos usados em registros diversos.

Campos principais:

* id
* tipo
* nome
* descricao
* status

### `parametros_sistema`

Configuracoes gerais do sistema.

Campos principais:

* id
* chave
* valor
* descricao

## Comercial

### `clientes`

Cadastro principal de clientes.

Campos principais:

* id
* tipo_pessoa
* razao_social
* nome_fantasia
* cnpj
* telefone
* email
* endereco
* observacoes
* status

### `clientes_contatos`

Contatos relacionados ao cliente.

Campos principais:

* id
* cliente_id
* nome
* cargo
* telefone
* email
* whatsapp
* principal
* status

### `clientes_unidades`

Unidades do cliente em diferentes aeroportos ou localidades.

Campos principais:

* id
* cliente_id
* aeroporto_id
* nome_unidade
* endereco_operacional
* observacoes
* status

### `servicos`

Catalogo de servicos oferecidos.

Campos principais:

* id
* codigo
* nome
* descricao
* unidade_medida
* tempo_padrao_minutos
* exige_funcao_especifica
* status

### `equipamentos_tipos`

Tipos de equipamentos previstos em contrato ou operacao.

Campos principais:

* id
* nome
* descricao
* unidade_medida
* status

### `contratos`

Cadastro principal do contrato.

Campos principais:

* id
* cliente_id
* filial_id
* numero_contrato
* nome_contrato
* objeto
* data_inicio
* data_fim
* status
* renovacao_automatica
* observacoes

### `contrato_servicos`

Servicos previstos no contrato.

Campos principais:

* id
* contrato_id
* servico_id
* quantidade_prevista
* unidade_medida
* tempo_padrao_minutos
* ativo

### `contrato_equipamentos`

Equipamentos previstos no contrato.

Campos principais:

* id
* contrato_id
* equipamento_tipo_id
* quantidade_prevista
* forma_cobranca
* ativo

### `contrato_precos`

Precos negociados por vigencia.

Campos principais:

* id
* contrato_id
* servico_id
* equipamento_tipo_id
* vigencia_inicio
* vigencia_fim
* valor_unitario
* adicional_noturno
* adicional_feriado
* observacoes
* ativo

### `contrato_sla`

Regras de prazo, resposta e execucao.

Campos principais:

* id
* contrato_id
* servico_id
* tempo_resposta_min
* tempo_execucao_min
* tolerancia_atraso_min
* observacoes

### `propostas_comerciais`

Propostas antes da formalizacao do contrato.

Campos principais:

* id
* cliente_id
* numero_proposta
* data_emissao
* validade
* status
* valor_estimado
* observacoes

### `proposta_itens`

Itens da proposta comercial.

Campos principais:

* id
* proposta_id
* servico_id
* equipamento_tipo_id
* quantidade
* valor_unitario
* observacoes

### `atendimentos_emergenciais`

Solicitacoes extraordinarias fora da rotina habitual.

Campos principais:

* id
* cliente_id
* contrato_id
* aeroporto_id
* data_solicitacao
* data_prevista
* tipo_atendimento
* descricao
* prioridade
* status
* solicitante_nome
* solicitante_contato
* observacoes

### `atendimento_emergencial_itens`

Detalhamento dos itens do atendimento emergencial.

Campos principais:

* id
* atendimento_emergencial_id
* servico_id
* quantidade
* tempo_estimado_min
* observacoes

## Operacional

### `postos_trabalho`

Locais ou posicoes operacionais.

Campos principais:

* id
* filial_id
* aeroporto_id
* nome
* descricao
* tipo_posto
* capacidade_pessoas
* ativo

### `postos_funcoes`

Funcoes permitidas em cada posto.

Campos principais:

* id
* posto_trabalho_id
* funcao_operacional_id

### `turnos`

Turnos operacionais.

Campos principais:

* id
* nome
* hora_inicio
* hora_fim
* tolerancia_atraso_min
* status

### `atendimentos`

Registro operacional de atendimento planejado ou executado.

Campos principais:

* id
* cliente_id
* contrato_id
* servico_id
* aeroporto_id
* filial_id
* data_atendimento
* hora_inicio_prevista
* hora_fim_prevista
* hora_inicio_real
* hora_fim_real
* posto_trabalho_id
* quantidade_prevista
* quantidade_realizada
* status
* origem
* observacoes

### `atendimento_equipes`

Equipe vinculada ao atendimento.

Campos principais:

* id
* atendimento_id
* colaborador_id
* funcao_operacional_id
* lider
* hora_inicio_real
* hora_fim_real

### `atendimento_equipamentos`

Equipamentos utilizados no atendimento.

Campos principais:

* id
* atendimento_id
* equipamento_id
* hora_inicio_uso
* hora_fim_uso
* observacoes

### `voos`

Dados dos voos que influenciam a operacao.

Campos principais:

* id
* cliente_id
* companhia_aerea
* numero_voo
* tipo_voo
* origem
* destino
* data_operacao
* eta
* etd
* ata
* atd
* aeronave_modelo
* prefixo_aeronave
* status

### `voo_atendimentos`

Relacionamento entre voo e atendimento.

Campos principais:

* id
* voo_id
* atendimento_id

### `alocacoes`

Distribuicao da mao de obra.

Campos principais:

* id
* data
* turno_id
* posto_trabalho_id
* atendimento_id
* colaborador_id
* funcao_operacional_id
* origem_alocacao
* status
* observacoes

### `escala_publicada`

Cabecalho da escala gerada.

Campos principais:

* id
* filial_id
* periodo_inicio
* periodo_fim
* data_geracao
* gerado_por_usuario_id
* status
* observacoes

### `escala_itens`

Itens da escala publicada.

Campos principais:

* id
* escala_publicada_id
* data
* colaborador_id
* turno_id
* posto_trabalho_id
* funcao_operacional_id
* atendimento_id
* tipo_alocacao
* origem
* observacoes

### `regras_escala`

Regras da escala inteligente.

Campos principais:

* id
* nome
* descricao
* tipo_regra
* valor_parametro
* prioridade
* ativo

### `restricoes_colaborador`

Restricoes individuais para alocacao.

Campos principais:

* id
* colaborador_id
* tipo_restricao
* descricao
* data_inicio
* data_fim
* ativo

### `disponibilidade_colaborador`

Disponibilidade do colaborador.

Campos principais:

* id
* colaborador_id
* data
* hora_inicio
* hora_fim
* tipo_disponibilidade
* observacoes

### `ocorrencias_operacionais`

Problemas e eventos da operacao.

Campos principais:

* id
* atendimento_id
* voo_id
* colaborador_id
* posto_trabalho_id
* tipo_ocorrencia
* descricao
* severidade
* data_hora
* status
* responsavel_tratativa_id

## RH

### `colaboradores`

Cadastro principal dos funcionarios.

Campos principais:

* id
* matricula
* nome
* cpf
* rg
* data_nascimento
* sexo
* telefone
* email
* endereco
* data_admissao
* data_desligamento
* filial_id
* setor_id
* cargo_id
* tipo_contrato
* status

### `colaborador_documentos`

Documentos do colaborador.

Campos principais:

* id
* colaborador_id
* tipo_documento
* numero_documento
* data_emissao
* data_validade
* arquivo_url
* status

### `colaborador_funcoes`

Funcoes que o colaborador esta habilitado a executar.

Campos principais:

* id
* colaborador_id
* funcao_operacional_id
* nivel_proficiencia
* principal
* ativo

### `treinamentos`

Catalogo de treinamentos.

Campos principais:

* id
* nome
* descricao
* validade_meses
* obrigatorio
* status

### `colaborador_treinamentos`

Treinamentos realizados pelo colaborador.

Campos principais:

* id
* colaborador_id
* treinamento_id
* data_realizacao
* data_validade
* status
* observacoes

### `cliente_habilitacoes`

Exigencias de treinamento ou habilitacao por cliente.

Campos principais:

* id
* cliente_id
* funcao_operacional_id
* treinamento_id
* obrigatorio

### `afastamentos`

Afastamentos diversos.

Campos principais:

* id
* colaborador_id
* tipo_afastamento
* data_inicio
* data_fim
* motivo
* observacoes
* status

### `ferias`

Controle de ferias.

Campos principais:

* id
* colaborador_id
* periodo_aquisitivo_inicio
* periodo_aquisitivo_fim
* data_inicio
* data_fim
* status

### `banco_horas`

Lancamentos de banco de horas.

Campos principais:

* id
* colaborador_id
* data_referencia
* tipo_movimento
* horas
* origem
* observacoes

### `jornadas_colaborador`

Jornada atribuida ao colaborador por periodo.

Campos principais:

* id
* colaborador_id
* tipo_jornada_id
* data_inicio
* data_fim
* ativo

### `ponto_registros`

Marcacoes de ponto.

Campos principais:

* id
* colaborador_id
* data_hora
* tipo_marcacao
* origem_marcacao
* observacoes

### `uniformes_epi_tipos`

Tipos de uniforme e EPI.

Campos principais:

* id
* nome
* descricao
* controle_validade
* status

### `colaborador_uniformes_epi`

Entregas de uniforme e EPI.

Campos principais:

* id
* colaborador_id
* uniforme_epi_tipo_id
* quantidade
* data_entrega
* data_prevista_troca
* observacoes

### `historico_funcional`

Mudancas de cargo, filial, setor, funcao e demais eventos relevantes.

Campos principais:

* id
* colaborador_id
* tipo_evento
* data_evento
* descricao
* usuario_responsavel_id
