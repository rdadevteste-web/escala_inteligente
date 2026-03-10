# Regras de Negocio Iniciais

## Regras gerais

* Todo cadastro deve possuir status para controle de ativo e inativo.
* Todo registro importante deve possuir historico de criacao, alteracao e exclusao logica.
* Exclusao fisica deve ser evitada para dados operacionais e contratuais.
* Um usuario so pode visualizar ou alterar dados conforme o perfil de acesso.
* Filiais podem ter operacoes diferentes e precisam ser consideradas como unidades independentes em varios cadastros.

## Regras de Administracao

* Usuario pode ter mais de um perfil de acesso.
* Perfil pode ter varias permissoes.
* Funcao operacional e diferente de cargo.
* Jornada define a base de horas do colaborador.
* Escala modelo pode ser reutilizada para varios colaboradores.

## Regras de Comercial

* Um cliente pode ter varios contatos.
* Um cliente pode ter varias unidades operacionais.
* Um contrato pertence a um cliente.
* Um contrato pode conter varios servicos.
* Um contrato pode conter varios equipamentos previstos.
* Um servico pode ter precos diferentes conforme vigencia contratual.
* Atendimento emergencial pode existir com ou sem vinculo a contrato, conforme regra da empresa.
* SLA pode variar por servico dentro do contrato.

## Regras de Operacao

* Atendimento pode estar ligado a contrato, cliente e servico.
* Atendimento pode ser planejado ou emergencial.
* Um atendimento pode ter varios colaboradores alocados.
* Um atendimento pode utilizar varios equipamentos.
* Um colaborador nao pode ser alocado em dois postos no mesmo horario.
* Colaborador afastado nao pode ser alocado.
* Colaborador em ferias nao pode ser alocado.
* Colaborador sem habilitacao obrigatoria nao pode ser alocado em funcao que exija treinamento.
* Escala publicada deve gerar historico sempre que sofrer ajuste posterior.
* Regras da escala inteligente devem respeitar jornada, descanso, disponibilidade, ferias, afastamentos e habilitacoes.

## Regras de RH

* Um colaborador pode ter mais de uma funcao operacional habilitada.
* Treinamentos podem ter validade e vencimento.
* Alguns clientes podem exigir treinamentos especificos.
* Afastamentos e ferias devem bloquear alocacao operacional no periodo.
* Banco de horas pode receber creditos e debitos.
* Jornada do colaborador pode mudar ao longo do tempo, mantendo historico.
* Documentos e credenciais com validade vencida podem impedir atuacao em determinadas operacoes.
