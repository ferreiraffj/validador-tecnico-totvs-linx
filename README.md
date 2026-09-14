# Validador Técnico TOTVS Linx

Aplicação web para coleta e validação da infraestrutura de lojas para os sistemas TasteOne PDV, TasteOne Autoatendimento e Degust PDV.

## Documentação técnica

Para entender a arquitetura, o fluxo de auditoria, os contratos da API, a integração multimodal, a organização dos diretórios e os procedimentos de manutenção, consulte [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Desenvolvimento local

Pré-requisito: Node.js 20 ou superior.

```powershell
npm.cmd install
Copy-Item .env.example .env
```

Preencha `GEMINI_API_KEY` no arquivo `.env` e inicie:

```powershell
npm.cmd run dev
```

A aplicação ficará disponível em <http://localhost:3000/>.

### Interpretação de imagens

No chat, use o botão de imagem para anexar até três capturas de tela em PNG, JPG ou WebP. O auditor pode interpretar telas de informações do Windows, como sistema operacional, processador, memória, armazenamento e testes de internet. Informe também o sistema escolhido na mensagem, pois a imagem não substitui essa seleção.

As imagens são redimensionadas e convertidas no navegador antes do envio. Elas são encaminhadas somente junto à solicitação atual e podem permanecer temporariamente no `localStorage` do navegador junto com o histórico recente. Não são armazenadas no servidor.

As imagens em `documentacao-de-requisitos/exemplos-especificacoes-windows` servem como referência para os tipos de evidência que o usuário pode enviar; elas não são carregadas pela API nem usadas como treinamento a cada requisição.

Validações e build:

```powershell
npm.cmd run lint
npm.cmd run build
```

## Arquitetura de produção

O frontend é compilado pelo Vite para `dist/`. As rotas da API são funções serverless:

- `api/chat.ts`: processamento do auditor.
- `api/health.ts`: verificação de saúde.

O arquivo `server.ts` continua disponível para desenvolvimento local e reutiliza os mesmos handlers da API. Na Vercel, o `app.listen` não é executado.

## Publicação no GitHub

1. Crie um repositório no GitHub.
2. Não publique `.env`, chaves de API, `node_modules` ou `dist`.
3. Na raiz do projeto, execute:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Substitua a URL pelo repositório real. O arquivo `.env.example` pode ser publicado, pois não contém segredo.

## Publicação na Vercel

1. Acesse <https://vercel.com> e escolha **Add New Project**.
2. Importe o repositório do GitHub.
3. Use `npm install` como instalação; a Vercel detectará o Vite e o `vercel.json`.
4. Em **Environment Variables**, adicione:

```text
GEMINI_API_KEY
```

Cadastre a chave nos ambientes necessários (Production, Preview e Development).
5. Clique em **Deploy**.
6. Após o deploy, teste:

```text
https://SEU_DOMINIO.vercel.app/
https://SEU_DOMINIO.vercel.app/api/health
```

O histórico dos chats permanece apenas no `localStorage` do navegador. Não há contas ou banco de dados nessa versão.
