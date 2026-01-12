# 🍔 Pedido Rápido

Sistema web completo e escalável para gestão de quiosques, cardápio digital, controle de estoque e experiência do cliente via QR Code.

## 📋 Sobre o Projeto

O **Pedido Rápido** é uma solução SaaS profissional inspirada no modelo do iFood, desenvolvida para atender estabelecimentos como quiosques, lanchonetes, bares e restaurantes de pequeno a médio porte.

### Principais Funcionalidades

- 📱 **Cardápio Digital** - Acesso via QR Code, otimizado para mobile
- 🏪 **Multi-quiosques** - Gerencie múltiplos estabelecimentos
- 📦 **Controle de Estoque** - Insumos, receitas e alertas automáticos
- 👥 **RBAC** - Controle de acesso por níveis (Super Admin, Admin, Cliente)
- 🌙 **Tema Dark/Light** - Interface moderna e personalizável
- 📊 **Dashboard** - Métricas e relatórios em tempo real

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** styled-components + Material UI (MUI)
- **Estado:** Context API
- **Arquitetura:** Clean Architecture com separação de responsabilidades

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pedido-rapido.git

# Entre na pasta do projeto
cd pedido-rapido

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Credenciais de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Super Admin | super@pedidorapido.com | admin123 |
| Admin Quiosque | admin@quiosque.com | admin123 |
| Cliente | cliente@email.com | cliente123 |

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas e páginas (App Router)
│   ├── (public)/          # Páginas públicas
│   ├── (auth)/            # Páginas de autenticação
│   ├── super-admin/       # Painel Super Administrador
│   ├── admin/             # Painel Admin do Quiosque
│   └── menu/              # Cardápio digital (cliente)
├── components/            # Componentes reutilizáveis
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── Modal/
│   └── ...
├── contexts/              # Context API (Theme, Auth, etc)
├── services/              # Serviços e APIs
├── utils/                 # Utilitários (formatters, validators)
├── styles/                # Tema e estilos globais
└── types/                 # Definições TypeScript
```

## 👥 Perfis de Acesso (RBAC)

### Super Administrador
- Gerenciamento de quiosques
- Controle de licenças
- Métricas globais
- Ativação/desativação de estabelecimentos

### Administrador do Quiosque
- Cadastro de produtos
- Gerenciamento de cardápio
- Controle de estoque
- Receitas e insumos
- Visualização de pedidos

### Cliente/Usuário Final
- Acesso via QR Code
- Visualização do cardápio
- Realização de pedidos
- Interface mobile-first

## 📦 Controle de Estoque

O sistema implementa um controle de estoque inteligente:

- **Insumos** - Cadastro com unidade de medida, custo e fornecedor
- **Receitas** - Associação de insumos com quantidades
- **Débito Automático** - Ao registrar pedido, insumos são debitados
- **Alertas** - Notificações de estoque baixo/esgotado

## 🎨 Temas

O sistema suporta tema claro e escuro, com persistência da preferência do usuário.

```tsx
import { useTheme } from '@/contexts';

const { toggleTheme, isDarkMode } = useTheme();
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
npm run type-check  # Verifica tipos TypeScript
```

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📱 Screenshots

### Página Inicial
Interface moderna e responsiva com apresentação do produto.

### Cardápio Digital
Acesso rápido via QR Code, categorias e busca de produtos.

### Painel Admin
Dashboard com métricas, gestão de produtos e controle de estoque.

## 🔜 Roadmap

- [ ] Integração com gateways de pagamento (PIX, cartão)
- [ ] Notificações em tempo real (WebSockets)
- [ ] App mobile nativo (React Native)
- [ ] Relatórios avançados com exportação
- [ ] Integração com impressoras térmicas
- [ ] Sistema de fidelidade/cupons

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas, entre em contato através de:
- Email: suporte@pedidorapido.com
- Issues: GitHub Issues

---

Desenvolvido com ❤️ pela equipe Pedido Rápido

