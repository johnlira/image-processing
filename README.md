# Image Processing Service

API REST para processamento e gerenciamento de imagens com autenticação JWT e armazenamento em S3.

## Índice

- [Stack e Tecnologias](#stack-e-tecnologias)
- [Rotas da API](#rotas-da-api)
  - [Autenticação](#autenticação)
  - [Imagens](#imagens)
- [Melhorias Futuras](#melhorias-futuras)

## Stack e Tecnologias

### Runtime e Linguagem
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação

### Framework e Bibliotecas
- **Express.js 5** - Framework web
- **Zod** - Validação de schemas
- **Pino** - Sistema de logging estruturado

### Banco de Dados
- **PostgreSQL 16** - Banco de dados relacional

### Storage
- **AWS S3** - Armazenamento de objetos
- **LocalStack** - Emulação local do AWS S3 para desenvolvimento

### Autenticação e Segurança
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas

### Processamento de Imagens
- **Sharp** - Processamento e manipulação de imagens

### Upload de Arquivos
- **Multer** - Middleware para upload de arquivos

### Infraestrutura
- **Docker Compose** - Orquestração de containers
- **PostgreSQL 16** (container)
- **LocalStack** (container)

### Ferramentas de Desenvolvimento
- **tsx** - Execução de TypeScript
- **pnpm** - Gerenciador de pacotes

## Rotas da API

Base URL: `/api`

### Autenticação

#### POST /api/auth/register

Registra um novo usuário no sistema.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "name": "string (mínimo 2 caracteres)",
  "email": "string (email válido)",
  "password": "string (mínimo 8 caracteres)"
}
```

**Response 201:**
```json
{
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "created_at": "date"
  }
}
```

**Códigos de Status:**
- `201` - Usuário criado com sucesso
- `400` - Erro de validação
- `409` - Email já cadastrado

---

#### POST /api/auth/login

Realiza login e retorna token de autenticação (armazenado em cookie).

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "string (email válido)",
  "password": "string (obrigatório)"
}
```

**Response 200:**
```json
{
  "message": "Logged in successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "created_at": "date"
  }
}
```

**Códigos de Status:**
- `200` - Login realizado com sucesso
- `400` - Erro de validação
- `401` - Email ou senha inválidos

---

#### GET /api/auth/me

Retorna informações do usuário autenticado.

**Autenticação:** Requerida (cookie com token JWT)

**Request:** Sem body

**Response 200:**
```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "created_at": "date"
  }
}
```

**Códigos de Status:**
- `200` - Usuário retornado com sucesso
- `401` - Token não fornecido ou inválido
- `404` - Usuário não encontrado

---

#### POST /api/auth/logout

Realiza logout removendo o token de autenticação.

**Autenticação:** Não requerida (mas remove cookie se existir)

**Request:** Sem body

**Response 200:**
```json
{
  "message": "Logged out successfully"
}
```

**Códigos de Status:**
- `200` - Logout realizado com sucesso

---

### Imagens

#### POST /api/images

Faz upload de uma imagem para o S3 e registra no banco de dados.

**Autenticação:** Requerida (cookie com token JWT)

**Request:** 
- Content-Type: `multipart/form-data`
- Campo: `image` (arquivo)
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/jpg`
- Tamanho máximo: 10MB

**Response 200:**
```json
{
  "message": "Image uploaded successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "originalName": "string",
    "storageKey": "string",
    "mimeType": "string",
    "size": "number",
    "dimensions": {
      "width": "number",
      "height": "number",
      "format": "string"
    },
    "createdAt": "date",
    "url": "string (presigned URL válida por 1 hora)"
  }
}
```

**Códigos de Status:**
- `200` - Imagem enviada com sucesso
- `400` - Erro de validação (tipo ou tamanho inválido)
- `401` - Token não fornecido ou inválido
- `500` - Erro ao processar ou fazer upload da imagem

---

#### GET /api/images

Lista todas as imagens do usuário autenticado.

**Autenticação:** Requerida (cookie com token JWT)

**Request:** Sem body

**Response 200:**
```json
{
  "message": "Images retrieved successfully",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "originalName": "string",
      "storageKey": "string",
      "mimeType": "string",
      "size": "number",
      "dimensions": {
        "width": "number",
        "height": "number",
        "format": "string"
      },
      "createdAt": "date",
      "url": "string (presigned URL válida por 1 hora)"
    }
  ]
}
```

**Códigos de Status:**
- `200` - Lista retornada com sucesso
- `401` - Token não fornecido ou inválido

---

#### GET /api/images/:id

Retorna uma imagem específica por ID.

**Autenticação:** Requerida (cookie com token JWT)

**Request Params:**
- `id` - UUID da imagem

**Response 200:**
```json
{
  "message": "Image retrieved successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "originalName": "string",
    "storageKey": "string",
    "mimeType": "string",
    "size": "number",
    "dimensions": {
      "width": "number",
      "height": "number",
      "format": "string"
    },
    "createdAt": "date",
    "url": "string (presigned URL válida por 1 hora)"
  }
}
```

**Códigos de Status:**
- `200` - Imagem retornada com sucesso
- `401` - Token não fornecido ou inválido
- `404` - Imagem não encontrada ou não pertence ao usuário

---

#### DELETE /api/images/:id

Deleta uma imagem do S3 e do banco de dados.

**Autenticação:** Requerida (cookie com token JWT)

**Request Params:**
- `id` - UUID da imagem

**Response 200:**
```json
{
  "message": "Image deleted successfully"
}
```

**Códigos de Status:**
- `200` - Imagem deletada com sucesso
- `401` - Token não fornecido ou inválido
- `404` - Imagem não encontrada ou não pertence ao usuário
- `500` - Erro ao deletar do S3 ou banco de dados

---

## Melhorias Futuras

- [ ] Adicionar suporte para compressão de imagens antes do upload
- [ ] Implementar sistema de tags/categorias para imagens
- [ ] Adicionar busca e filtros avançados para listagem de imagens
- [ ] Implementar paginação na listagem de imagens
- [ ] Adicionar rate limiting para prevenir abuso da API
- [ ] Adicionar testes automatizados (unitários e integração)
