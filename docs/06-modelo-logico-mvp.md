# Modelo Logico MVP

## Objetivo

Este documento transforma a documentacao funcional em um formato mais pratico para modelagem de banco e criacao de migrations.

## Colunas padrao da planilha

* `modulo`: agrupamento funcional.
* `tabela`: nome da tabela.
* `campo`: nome do campo.
* `tipo`: tipo logico sugerido para banco relacional.
* `obrigatorio`: `sim` ou `nao`.
* `pk`: indica chave primaria.
* `fk_tabela`: tabela referenciada quando houver chave estrangeira.
* `fk_campo`: campo referenciado quando houver chave estrangeira.
* `descricao`: finalidade do campo.

## Convencoes iniciais

* Chaves primarias usam `bigint` ou `uuid`. Neste rascunho foi adotado `bigint` para simplificar o MVP.
* Campos de texto livre usam `text`.
* Campos curtos usam `varchar`.
* Datas sem horario usam `date`.
* Datas com horario usam `timestamp`.
* Valores monetarios usam `decimal(14,2)`.
* Flags booleanas usam `boolean`.
* Toda tabela relevante do MVP recebe campos padrao de auditoria.

## Campos padrao de auditoria

Campos reaproveitados na maior parte das tabelas:

* `id`
* `created_at`
* `updated_at`
* `deleted_at`
* `created_by`
* `updated_by`
* `deleted_by`
* `status`

## Observacoes de implementacao

* `created_by`, `updated_by` e `deleted_by` referenciam `usuarios.id`.
* `deleted_at` e `deleted_by` suportam exclusao logica.
* Tabelas de relacionamento simples podem manter auditoria reduzida em fase posterior, mas neste MVP a recomendacao e manter o padrao completo.
* O arquivo CSV em `database/diagramas/mvp-dicionario-dados.csv` deve ser a base para refinamento do modelo fisico.

## Proximo passo recomendado

1. Validar tipos e obrigatoriedade com a regra de negocio.
2. Definir unicidade e indices por tabela.
3. Gerar o DER.
4. Criar migrations do banco a partir desse dicionario.
