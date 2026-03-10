# Padrao de Auditoria, Historico e Logs

## 1. Campos padrao recomendados para quase todas as tabelas

Campos recomendados:

* `id`
* `created_at`
* `updated_at`
* `deleted_at`
* `created_by`
* `updated_by`
* `deleted_by`
* `status`

### Explicacao

* `created_at`: data e hora da criacao do registro.
* `updated_at`: data e hora da ultima alteracao.
* `deleted_at`: data e hora da exclusao logica.
* `created_by`: usuario que criou.
* `updated_by`: usuario que alterou por ultimo.
* `deleted_by`: usuario que excluiu logicamente.
* `status`: situacao do registro, por exemplo ativo, inativo, bloqueado, cancelado.

## 2. Exclusao logica

Recomendacao:

* evitar apagar registros importantes do banco;
* ao excluir, preencher `deleted_at` e `deleted_by`;
* tratar o registro como inativo para o sistema.

Isso ajuda a:

* manter rastreabilidade;
* evitar perda de historico;
* facilitar auditoria;
* reduzir problemas operacionais e financeiros.

## 3. Tabela de log de auditoria

### `auditoria_logs`

Tabela central para registrar mudancas relevantes.

Campos sugeridos:

* `id`
* `tabela_nome`
* `registro_id`
* `acao`
* `dados_anteriores`
* `dados_novos`
* `usuario_id`
* `data_hora`
* `ip_origem`
* `origem_sistema`
* `observacoes`

### Explicacao

* `tabela_nome`: nome da tabela alterada.
* `registro_id`: id do registro alterado.
* `acao`: criacao, alteracao, exclusao logica, restauracao, mudanca de status.
* `dados_anteriores`: conteudo anterior do registro.
* `dados_novos`: conteudo apos alteracao.
* `usuario_id`: quem fez a acao.
* `data_hora`: quando a acao aconteceu.
* `ip_origem`: opcional para identificar origem.
* `origem_sistema`: web, api, rotina automatica, importacao.
* `observacoes`: campo livre para contexto.

## 4. Tabela de historico por entidade

Algumas entidades podem precisar de historico proprio alem da tabela central de auditoria.

Exemplos:

* `historico_funcional`
* `historico_contrato_status`
* `historico_atendimento_status`
* `historico_escala`

### Quando criar historico proprio

Criar tabela de historico dedicada quando o processo for importante para analise futura, como:

* mudanca de status de contrato;
* ajustes em escala publicada;
* troca de cargo ou filial de colaborador;
* mudancas de status de atendimento operacional.

## 5. Tabela de logs tecnicos

### `sistema_logs`

Voltada para logs tecnicos e erros.

Campos sugeridos:

* `id`
* `tipo_log`
* `modulo`
* `mensagem`
* `detalhes`
* `stack_trace`
* `usuario_id`
* `data_hora`
* `origem`

### Exemplos de uso

* erro ao salvar contrato;
* falha na geracao da escala;
* erro de integracao com API externa;
* excecao no backend.
