import { describe, expect, it } from 'vitest';
import { DEFAULT_THUMBNAIL, normalizeMaterial, parseEditionValue, sortMaterials } from '../src/lib/content';

describe('parseEditionValue', () => {
  it('converte edição em valor comparável', () => {
    expect(parseEditionValue('2026.2')).toBeGreaterThan(parseEditionValue('2026.1'));
    expect(parseEditionValue(undefined)).toBe(0);
  });
});

describe('sortMaterials', () => {
  it('prioriza ano mais recente e depois edição', () => {
    const materials = sortMaterials([
      {
        id: 'a',
        data: {
          title: 'Material A',
          topicId: 'topico',
          downloadUrl: 'https://example.org/a.pdf',
          publishedDate: new Date('2025-01-01'),
          year: 2025,
        },
      },
      {
        id: 'b',
        data: {
          title: 'Material B',
          topicId: 'topico',
          downloadUrl: 'https://example.org/b.pdf',
          publishedDate: new Date('2026-01-01'),
          year: 2026,
          edition: '2026.2',
        },
      },
      {
        id: 'c',
        data: {
          title: 'Material C',
          topicId: 'topico',
          downloadUrl: 'https://example.org/c.pdf',
          publishedDate: new Date('2026-01-01'),
          year: 2026,
          edition: '2026.1',
        },
      },
    ]);

    expect(materials.map((material) => material.id)).toEqual(['b', 'c', 'a']);
  });
});

describe('normalizeMaterial', () => {
  it('gera fallback de thumbnail, tags derivadas e subcategoria por pasta', () => {
    const material = normalizeMaterial(
      {
        id: 'atividades-complementares/caderno-atividades/caderno-final',
        data: {
          title: 'Caderno das Atividades Complementares',
          summary: 'Documento de referência das atividades complementares.',
          topicId: 'atividades-complementares',
          downloadUrl: 'https://example.org/caderno.pdf',
          publishedDate: new Date('2026-04-15'),
        },
      },
      'Atividades Complementares'
    );

    expect(material.thumbnail).toBe(DEFAULT_THUMBNAIL);
    expect(material.subcategory).toBe('Caderno Atividades');
    expect(material.tags).toContain('Atividades Complementares');
    expect(material.tags).toContain('2026');
  });
});
