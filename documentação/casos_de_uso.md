[Voltar ao início](../README.md)

# Casos de uso
O objetivo deste documento é apresentar os principais casos de uso mapeados para a aplicação.

- Cadastrar produto químico
1. Objetivo: Adicionar novos produtos no sistema
2. Ator: Embarcador
3. Entrada esperada: Nome, estado físico, elementos químicos e observações
4. Saída Esperada: Produto químico cadastrado com sucesso
5. Principais regras de negócio: Nome, estado físico e elementos químicos são mandatórios
6. Possíveis erros ou exceções: Campos mandatórios em branco
- Registrar carga
1. Objetivo: Adicionar novas cargas no sistema
2. Ator: Embarcador
3. Entrada esperada: Código (caso vazio gerado automaticamente), produto químico e observações
4. Saída Esperada: Carga registrada com sucesso. Status alterado para "aguardando responsável técnico"
5. Principais regras de negócio: Produto químico deve estar com risco definido e é mandatório
6. Possíveis erros ou exceções: Campo mandatório em branco
- Definir risco do produto químico
1. Objetivo: Definir o risco da operação envolvendo o produto químico
2. Ator: Engenheiro químico
3. Entrada esperada: Risco do produto
4. Saída Esperada: Risco definido com sucesso
5. Principais regras de negócio: Campo "Risco" é obrigatório
6. Possíveis erros ou exceções: Campo mandatório em branco
- Definir risco da carga
1. Objetivo: Definir o risco do transporte da carga
2. Ator: Engenheiro químico
3. Entrada esperada: Risco da carga
4. Saída Esperada: Risco definido com sucesso
5. Principais regras de negócio: Campo "Risco" é obrigatório
6. Possíveis erros ou exceções: Campo mandatório em branco
- Definir responsável técnico
1. Objetivo: Designar um responsável técnico para toda a operação da carga
2. Ator: Engenheiro químico
3. Entrada esperada: Responsável técnico
4. Saída Esperada: Responsável técnico atribuído com sucesso e status alterado para "aguardando documentação"
5. Principais regras de negócio: Responsável técnico é mandatório e não pode estar designado a uma carga
6. Possíveis erros ou exceções: Campo mandatório em branco
- Registrar documentação da carga
1. Objetivo: Adicionar a documentação necessária para o transporte da carga
2. Ator: Responsável técnico
3. Entrada esperada: Documento em formato pdf
4. Saída Esperada: Documentação anexada com sucesso e notificação enviada para o engenheiro químico
5. Principais regras de negócio: O documento precisa ser em formato pdf
6. Possíveis erros ou exceções: Documento anexado em um formato diferente de pdf
- Revisar documentação da carga
1. Objetivo: Verificar se a documentação está de acordo com as normas estabelecidas e apresenta as informações corretas sobre a carga
2. Ator: Engenheiro químico
3. Entrada esperada: Resultado da revisão e mudanças necessárias (caso rejeitada)
4. Saída Esperada: Documento revisado e status alterado para "aguardando inspeção" caso aprovada
5. Principais regras de negócio: Mudanças necessárias é obrigatório caso o documento seja rejeitado
6. Possíveis erros ou exceções: Em caso de rejeição a documentação precisa ser reenviada com as mudanças que o engenheiro apresentou e deve passar por uma nova revisão
- Requisitar inspeção da carga
1. Objetivo: Fazer o pedido da inspeção
2. Ator: Responsável técnico
3. Entrada esperada: -
4. Saída Esperada: Inspeção requisitada com sucesso e notificação enviada para o inspetor
5. Principais regras de negócio: -
6. Possíveis erros ou exceções: -
- Realizar inspeção da carga
1. Objetivo: Validar se a carga está conforme o esperado documentado anteriormente
2. Ator: Inspetor
3. Entrada esperada: Resultado da inspeção, tipo de pendência encontrada e mudanças necessárias (caso rejeitado)
4. Saída Esperada: Inspeção realizada com sucesso e status alterado para "pronta" caso aprovado
5. Principais regras de negócio: Tipo de pendência e mudanças necessárias são mandatórios caso rejeitado
6. Possíveis erros ou exceções: Em caso de rejeição a inspeção precisa ser requisitada novamente com as mudanças que o inspetor apresentou
