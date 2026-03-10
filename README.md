# ERP Aeroportuario

Base inicial de documentacao para estruturar um ERP de servicos aeroportuarios, com foco em modulos, tabelas, regras de negocio e padroes de auditoria.

## Estrutura

```text
docs/
  01-visao-geral.md
  02-modulos.md
  03-tabelas.md
  04-regras-de-negocio.md
  05-auditoria-e-logs.md
  06-modelo-logico-mvp.md
backend/
frontend/
database/
  migrations/
  seeds/
  diagramas/
    mvp-dicionario-dados.csv
```

## Documentos

* [Visao geral](docs/01-visao-geral.md)
* [Modulos](docs/02-modulos.md)
* [Tabelas por modulo](docs/03-tabelas.md)
* [Regras de negocio](docs/04-regras-de-negocio.md)
* [Auditoria e logs](docs/05-auditoria-e-logs.md)
* [Modelo logico MVP](docs/06-modelo-logico-mvp.md)
* [Dicionario de dados MVP CSV](database/diagramas/mvp-dicionario-dados.csv)

## Proximo passo recomendado

Validar o dicionario de dados do MVP, definir indices e restricoes, e entao gerar as primeiras migrations do banco.
