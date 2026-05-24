# Bíblia API - ACF (Almeida Corrigida Fiel)

API estática gratuita da Bíblia Sagrada hospedada no GitHub Pages.

## Como usar

Base URL: `https://seuusuario.github.io/biblia-api/api`

### Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `/api/index.json` | Lista todos os livros |
| `/api/{livro}/index.json` | Info do livro + capítulos |
| `/api/{livro}/{capitulo}.json` | Versículos do capítulo |

### Exemplos

```
# Todos os livros
GET /api/index.json

# Informações de Gênesis
GET /api/genesis/index.json

# João capítulo 3
GET /api/joao/3.json

# Salmos capítulo 23
GET /api/salmos/23.json
```

### Exemplo de resposta — João 3

```json
{
  "livro": "Joao",
  "slug_livro": "joao",
  "capitulo": 3,
  "total_versiculos": 36,
  "versiculos": [
    {
      "numero": 1,
      "texto": "Havia entre os fariseus um homem chamado Nicodemos..."
    },
    {
      "numero": 16,
      "texto": "Porque Deus amou o mundo de tal maneira..."
    }
  ]
}
```

## Como gerar os arquivos

```bash
node gerar.js
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub chamado `biblia-api`
2. Rode `node gerar.js` para gerar os arquivos
3. Faça push de tudo para o GitHub
4. Vá em **Settings → Pages → Branch: main → Save**
5. Pronto! Sua API estará em `https://seuusuario.github.io/biblia-api/api`

## Fonte dos dados

Dados da Bíblia ACF: [thiagobodruk/biblia](https://github.com/thiagobodruk/biblia)
