import { describe, expect, it } from 'vitest';
import { materialSchema, topicSchema } from '../src/lib/contentSchemas';

describe('topicSchema', () => {
  it('aceita um tópico válido com status padrão', () => {
    const parsed = topicSchema.parse({
      title: 'Formação Geral Básica',
      description: 'Materiais voltados à formação geral básica do ensino médio.',
      order: 1,
    });

    expect(parsed.status).toBe('published');
  });
});

describe('materialSchema', () => {
  it('aceita um material válido com thumbnail local opcional e arquivo local do projeto', () => {
    const parsed = materialSchema.parse({
      title: 'Matemática 2026',
      summary: 'Organizador curricular trimestral de matemática.',
      topicId: 'formacao-geral-basica',
      thumbnail: '/images/materials/default-material.svg',
      downloadUrl: '/files/formacao-geral-basica/matematica.pdf',
      publishedDate: '2026-04-15',
      year: 2026,
      tags: ['matemática', 'formação geral básica'],
    });

    expect(parsed.published).toBe(true);
    expect(parsed.thumbnail).toBe('/images/materials/default-material.svg');
  });

  it('também aceita URL externa válida quando necessário', () => {
    const parsed = materialSchema.parse({
      title: 'Documento externo',
      summary: 'Resumo suficientemente descritivo.',
      topicId: 'formacao-geral-basica',
      downloadUrl: 'https://example.org/documento.pdf',
      publishedDate: '2026-04-15',
    });

    expect(parsed.downloadUrl).toBe('https://example.org/documento.pdf');
  });

  it('rejeita thumbnail fora do projeto', () => {
    expect(() =>
      materialSchema.parse({
        title: 'Material inválido',
        summary: 'Resumo suficientemente descritivo para o teste.',
        topicId: 'formacao-geral-basica',
        thumbnail: 'https://example.org/capa.jpg',
        downloadUrl: '/files/formacao-geral-basica/invalido.pdf',
        publishedDate: '2026-04-15',
      })
    ).toThrow();
  });

  it('exige summary ou description', () => {
    expect(() =>
      materialSchema.parse({
        title: 'Sem resumo',
        topicId: 'formacao-geral-basica',
        downloadUrl: '/files/formacao-geral-basica/sem-resumo.pdf',
        publishedDate: '2026-04-15',
      })
    ).toThrow('Material precisa ter summary ou description.');
  });
});
