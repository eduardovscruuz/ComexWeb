# Sistema de Gestão de Escalas e Manifestos - Frontend Angular

## 📋 Descrição

Sistema frontend desenvolvido em Angular para gerenciamento de escalas de navios e manifestos de carga. A aplicação permite visualizar, vincular e gerenciar a relação entre escalas marítimas e manifestos de importação/exportação.

## ✨ Funcionalidades

- **Visualização de Escalas**: Lista de todas as escalas com status, datas e navios
- **Visualização de Manifestos**: Lista de manifestos com tipo, número e informações de porto
- **Sistema de Vinculação**: Interface para vincular manifestos a escalas e vice-versa
- **Filtros em Tempo Real**: Busca rápida em ambas as listas
- **Modal de Detalhes**: Visualização detalhada de escalas e manifestos
- **Interface Responsiva**: Design moderno com Angular Material

## 🛠️ Tecnologias Utilizadas

- **Angular 17+** (Standalone Components)
- **Angular Material** (UI Components)
- **TypeScript**
- **RxJS** (Programação reativa)
- **CSS3/SCSS** (Estilização)

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── modal-detalhes/
│   │   │   └── modal-detalhes.component.ts
│   │   ├── escala-vincular-modal/
│   │   │   └── escala-vincular-modal.component.ts
│   │   └── manifesto-vincular-modal/
│   │       └── manifesto-vincular-modal.component.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   └── app.config.ts
└── styles.scss
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Angular CLI 17+

### Instalação e Execução

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o servidor de desenvolvimento**

   ```bash
   ng serve
   # ou
   npm start
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:4200
   ```

### Build para Produção

```bash
ng build --configuration production
```

## 🎨 Componentes Principais

### AppComponent

Componente principal que gerencia as abas de escalas e manifestos, incluindo:

- Listagem de dados
- Filtros
- Modal de detalhes
- Navegação entre abas

### ModalDetalhesComponent

Modal para exibição detalhada de escalas e manifestos em formato JSON.

### EscalaVincularModalComponent

Modal para gerenciamento de vínculos entre uma escala e múltiplos manifestos.

### ManifestoVincularModalComponent

Modal para gerenciamento de vínculos entre um manifesto e múltiplas escalas.

## 🔌 Integração com API

A aplicação consome uma API RESTful com os seguintes endpoints:

| Endpoint                                 | Método | Descrição                 |
| ---------------------------------------- | ------ | ------------------------- |
| `/api/escalas`                           | GET    | Lista todas as escalas    |
| `/api/escalas/{id}`                      | GET    | Busca escala por ID       |
| `/api/manifestos`                        | GET    | Lista todos os manifestos |
| `/api/manifestos/{id}`                   | GET    | Busca manifesto por ID    |
| `/api/vinculos/{manifestoId}/{escalaId}` | POST   | Cria vínculo              |
| `/api/vinculos/{manifestoId}/{escalaId}` | DELETE | Remove vínculo            |

## 🎯 Funcionalidades de UI/UX

- **Tabs com Angular Material**: Navegação intuitiva entre escalas e manifestos
- **Tabelas sortáveis**: Ordenação por colunas
- **Checkboxes interativos**: Seleção múltipla nos modais de vinculação
- **Feedback visual**: Badges coloridos para status e tipos
- **Responsividade**: Layout adaptável para diferentes dispositivos

## 🎨 Estilos e Temas

A aplicação utiliza Angular Material com os seguintes recursos:

- Tema padrão do Material Design
- Cores semânticas para status (verde, laranja, azul, vermelho)
- Badges coloridos para identificação visual rápida
- Hover states para melhor usabilidade

## 📱 Navegação

1. **Aba Escalas**: Visualize e gerencie escalas de navios
2. **Aba Manifestos**: Visualize e gerencie manifestos de carga
3. **Click em linhas**: Abre modal de detalhes
4. **Botão "Adicionar/Editar Vinculação"**: Abre modal de gerenciamento de vínculos

## 🔧 Configurações

### Variáveis de Ambiente

Crie um arquivo `environment.ts` se necessário:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5252/api",
};
```

### Personalização

- Modifique cores no `styles.scss`
- Ajuste endpoints da API nos serviços
- Customize textos e labels nos templates

## 📄 Scripts Disponíveis

- `npm start` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm test` - Executa testes
- `npm run lint` - Executa linting do código

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para issues e dúvidas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.
