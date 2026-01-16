# Teleprompter

Um teleprompter web moderno e funcional que permite exibir texto com scroll automático para leitura em tela.

## Características

- ✨ Interface moderna e intuitiva
- 🎚️ Controle de velocidade ajustável (1-10)
- 📏 Ajuste de tamanho da fonte (20-80px)
- ⏯️ Controles de iniciar, pausar e resetar
- ⌨️ Atalhos de teclado para controle rápido
- 💾 Salvamento automático do texto no navegador
- 📱 Design responsivo

## Como Usar

1. **Abrir o projeto**: Abra o arquivo `index.html` em qualquer navegador moderno.

2. **Inserir texto**: Digite ou cole o texto que deseja exibir no teleprompter na área de texto à esquerda.

3. **Ajustar configurações**:
   - Use o controle de **Velocidade** para ajustar a velocidade do scroll (1 = mais lento, 10 = mais rápido)
   - Use o controle de **Tamanho da Fonte** para ajustar o tamanho do texto exibido

4. **Iniciar**: Clique no botão "Iniciar" para começar o scroll automático.

5. **Controles**:
   - **Iniciar**: Inicia o scroll automático
   - **Pausar**: Pausa o scroll (pode continuar depois)
   - **Resetar**: Para o scroll e volta ao início

## Atalhos de Teclado

- **Espaço**: Pausar/Continuar o scroll
- **Escape**: Resetar o teleprompter
- **Seta para Cima**: Aumentar velocidade (quando o teleprompter está rodando)
- **Seta para Baixo**: Diminuir velocidade (quando o teleprompter está rodando)

## Funcionalidades Técnicas

- O texto é salvo automaticamente no localStorage do navegador
- Scroll suave e contínuo
- Efeito de fade nas bordas superior e inferior para melhor visualização
- Interface responsiva que se adapta a diferentes tamanhos de tela

## Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Não requer instalação de dependências ou servidor

## Estrutura do Projeto

```
teleprompter/
├── index.html      # Estrutura HTML
├── styles.css      # Estilização
├── script.js       # Lógica e funcionalidades
└── README.md       # Este arquivo
```

## Dicas de Uso

- Para melhor visualização, use o modo de tela cheia do navegador (F11)
- Ajuste a velocidade conforme a necessidade de leitura
- O tamanho da fonte pode ser ajustado durante a execução
- O texto é preservado mesmo após fechar o navegador (até limpar o cache)
