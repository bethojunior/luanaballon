# Luana Balões 🎈

Loja festiva em Next.js 14 com painel administrativo (produtos, categorias, blog e configurações), MongoDB e MinIO.
O carrinho finaliza o pedido pelo WhatsApp.

## Stack
- **Next.js 14** (App Router) + Tailwind
- **MongoDB 7** (dados) · **MinIO** (imagens, servidas via `/api/media/...`, sem expor o MinIO)
- Tudo orquestrado por **Docker Compose** (o site responde direto na porta 80)

## Deploy no DigitalOcean
1. Crie um Droplet Ubuntu (2GB RAM recomendado) com **Docker** (Marketplace "Docker on Ubuntu") e, se tiver domínio, aponte um registro **A** para o IP (HTTPS: use o proxy/Cloudflare do seu domínio ou um Load Balancer do DigitalOcean com certificado).
2. Envie o projeto: `git clone ...` ou `rsync -av --exclude node_modules --exclude .next ./ root@SEU_IP:/opt/luana/`
3. No servidor:
   ```bash
   cd /opt/luana
   cp .env.example .env
   nano .env          # troque TODAS as senhas
   openssl rand -hex 32   # use o resultado em AUTH_SECRET
   docker compose up -d --build
   ```
4. Acesse `http://SEU_IP/admin` e entre com `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
5. Em **Configurações**, informe o WhatsApp da loja (só números, com 55 + DDD) — é para lá que os pedidos vão.

Firewall: libere apenas 22 e 8580 (e 443 se usar HTTPS na frente) (`ufw allow 22,8580,443/tcp && ufw enable`). Mongo não é exposto; o console do MinIO só em `127.0.0.1:8501` (acesse com `ssh -L 8501:localhost:8501 root@SEU_IP`).

Atualizar: `git pull && docker compose up -d --build`

Backup: volumes `mongo_data` e `minio_data`
(`docker compose exec mongo mongodump --archive -u $MONGO_USER -p $MONGO_PASSWORD --authenticationDatabase admin > backup.archive`).

## Desenvolvimento local
```bash
docker compose -f docker-compose.dev.yml up -d   # Mongo + MinIO
cp .env.example .env.local                        # descomente as variáveis de dev e defina ADMIN_*/AUTH_SECRET
npm install && npm run dev
```

## Painel (`/admin`)
| Seção | O que faz |
|---|---|
| Produtos | nome, preço (e preço "de"), descrição, várias fotos, categoria, destaque, visível |
| Categorias | temas exibidos na home e filtros da loja |
| Blog | posts em Markdown com capa, rascunho/publicado |
| Aparência | escolhe o layout ativo da loja: **Festa**, **Elegante** ou **Minimalista** |
| Configurações | nome, WhatsApp, textos da home, Instagram, e-mail, endereço |

Observação: o login usa um único admin definido por `ADMIN_EMAIL`/`ADMIN_PASSWORD` no `.env`.
