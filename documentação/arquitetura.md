[Voltar ao início](../README.md)

# Arquitetura do projeto

Dado o contexto da aplicação (organização de cargas químicas no Porto de Santos) e devido à dimensão do ambiente e a alta quantidade de cargas que chegam e saem diariamente do porto, se faz necessário adotar uma arquitetura que converse bem com as boas práticas e princípios da programação, como design patterns e princípios SOLID.

Além disso, devido à importância da aplicação no dia a dia e a possível necessidade de manutenção sem comprometer a funcionalidade da aplicação, é necessário escolher uma arquitetura que permita a evolução e implementação de possíveis novas funcionalidades não previstas no escopo inicial sem que seja necessário interromper sua funcionalidade.

Por fim, pensando na grande quantidade de dados que a aplicação deverá organizar e tendo em vista que a performance será de extrema importância para manter o processo o mais otimizado possível, é importante que a arquitetura escolhida facilite ao máximo a elaboração de testes automatizados para que seja possível estressar a aplicação ao máximo, testando os limites e trazendo melhorias para o usuário final.

Considerando todos os pontos listados acima, a arquitetura escolhida para a aplicação foi a clean architecture por conta da sua grande capacidade de organização e por atender bem a todas as necessidades da aplicação em todos os seus estágios de desenvolvimento, do início do desenvolvimento aos testes em massa e possíveis manutenções em produção.
