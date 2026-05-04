# CGEMP

Portal público da Coordenação de Ensino Médio para reunir materiais institucionais de forma clara, pesquisável e simples de manter.

## Stack

- Astro
- TypeScript
- Markdown + Content Collections
- Pagefind para busca estática
- Vitest
- Playwright
- Netlify

## Fluxo de trabalho

1. Ler `cgemp.md` antes de começar qualquer sessão.
2. Usar `CLAUDE.md` como guia operacional curto.
3. Trabalhar em recortes pequenos e funcionais.
4. Escrever ou atualizar testes junto com regras observáveis.
5. Não avançar com build ou testes quebrados.

## Estrutura editorial

- `src/content/topics`: define os tópicos principais.
- `src/content/materials`: define os materiais vinculados a cada tópico.
- `public/images/materials`: armazena thumbnails locais do acervo.
- `public/files`: armazena os arquivos reais disponibilizados para download no site.

## Comandos

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`
- `npm run test:e2e`
- `npm run check`

## CI

O pipeline esperado roda:

1. `npm run test`
2. `npm run build`
3. `npm run test:e2e`

Qualquer falha bloqueia a publicação.
