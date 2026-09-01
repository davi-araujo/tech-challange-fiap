[Voltar ao início](../README.md)

# Documentação de domínio
O objetivo deste arquivo é apresentar as principais informações e definições acerca do domínio da aplicação.

### Linguagem ubíqua
- Carga
- Produto químico
- Engenheiro químico
- Responsável técnico
- Inspetor
- Embarcador
- Navio
- Risco
- Pendência
- Documentação
- Inspeção

### Entidades
- Carga
- Produto químico
- Engenheiro químico
- Responsável técnico
- Inspetor
- Embarcador
- Documentação
- Inspeção

### Agregados
- Carga
- Documentação
- Inspeção

### Principais regras de negócio
- Um produto químico precisa ter um risco definido para poder ser atribuído a uma carga
- Uma carga precisa ter o risco definido para passar para a fase de documentação
- Uma carga precisa ter a documentação aprovada por um engenheiro químico para passar para a fase de inspeção
- Uma carga precisa ter a inspeção finalizada e aprovada por um inspetor para poder ser enviada
- Toda carga deve possuir um responsável técnico
