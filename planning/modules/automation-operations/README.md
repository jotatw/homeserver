# Automation and Operations

## Objetivo

Agrupa capacidades responsáveis por executar e coordenar mudanças na plataforma de forma verificável e recuperável.

## Escopo previsto

- instalação e remoção de módulos;
- start, stop, restart, enable e disable;
- atualização e migrations;
- automações administrativas;
- Operation Journal;
- reconciliação e recovery.

## Princípios fechados

Operação não é estado. Execução não é sucesso. Sucesso exige observação e verificação. Operações interrompidas devem ser reconciliadas antes de repetição cega.

## Concorrência

Operações incompatíveis sobre o mesmo alvo ou recurso compartilhado devem ser arbitradas pelo mecanismo futuro da plataforma.

## Estado

Planejamento funcional fechado. Persistência do Journal, mecanismo concreto de concorrência e recovery permanecem como decisões de implementação da M1.
