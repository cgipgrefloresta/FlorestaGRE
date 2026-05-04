export type TopicLike = {
  id: string;
  data: {
    title: string;
    description: string;
    summary?: string;
    order?: number;
    status?: 'draft' | 'published';
  };
};

export type MaterialLike = {
  id: string;
  data: {
    title: string;
    summary?: string;
    description?: string;
    topicId: string;
    subcategories?: string[];
    tags?: string[];
    thumbnail?: string;
    downloadUrl: string;
    publishedDate: Date;
    year?: number;
    edition?: string;
    subcategory?: string;
    order?: number;
    published?: boolean;
    sourceName?: string;
    sourceType?: string;
  };
};

export type NormalizedTopic = {
  id: string;
  title: string;
  description: string;
  summary: string;
  order: number;
  status: 'draft' | 'published';
};

export type NormalizedMaterial = {
  id: string;
  title: string;
  description: string;
  topicId: string;
  topicTitle: string;
  downloadUrl: string;
  thumbnail: string;
  tags: string[];
  year: number;
  edition?: string;
  subcategory?: string;
  order: number;
  published: boolean;
  publishedDate: Date;
  sourceName?: string;
  sourceType?: string;
};

export const DEFAULT_THUMBNAIL = '/images/materials/formacao-geral-basica/pernambuco.png';

export function sortTopics<T extends TopicLike>(topics: T[]) {
  return [...topics].sort((left, right) => {
    const orderDiff = (left.data.order ?? 0) - (right.data.order ?? 0);
    if (orderDiff !== 0) {
      return orderDiff;
    }

    return left.data.title.localeCompare(right.data.title, 'pt-BR');
  });
}

export function getPublishedTopics<T extends TopicLike>(topics: T[]) {
  return topics.filter((topic) => (topic.data.status ?? 'published') === 'published');
}

export function parseEditionValue(edition?: string) {
  if (!edition) {
    return 0;
  }

  const match = edition.match(/^(\d{4})(?:\.(\d+))?$/);
  if (!match) {
    return 0;
  }

  const year = Number(match[1]);
  const cycle = Number(match[2] ?? '0');
  return year * 100 + cycle;
}

export function compareMaterials(left: MaterialLike, right: MaterialLike) {
  const yearDiff = (right.data.year ?? right.data.publishedDate.getFullYear()) - (left.data.year ?? left.data.publishedDate.getFullYear());
  if (yearDiff !== 0) {
    return yearDiff;
  }

  const editionDiff = parseEditionValue(right.data.edition) - parseEditionValue(left.data.edition);
  if (editionDiff !== 0) {
    return editionDiff;
  }

  const orderDiff = (left.data.order ?? 0) - (right.data.order ?? 0);
  if (orderDiff !== 0) {
    return orderDiff;
  }

  return left.data.title.localeCompare(right.data.title, 'pt-BR');
}

export function sortMaterials<T extends MaterialLike>(materials: T[]) {
  return [...materials].sort(compareMaterials);
}

export function getPublishedMaterials<T extends MaterialLike>(materials: T[]) {
  return materials.filter((material) => material.data.published !== false);
}

export function deriveSubcategory(materialId: string) {
  const segments = materialId.split('/');
  if (segments.length < 3) {
    return undefined;
  }

  return humanizeSlug(segments[1]);
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function buildMaterialTags(material: MaterialLike, topicTitle: string) {
  const year = material.data.year ?? material.data.publishedDate.getFullYear();
  const derived = [
    topicTitle,
    material.data.title,
    String(year),
    material.data.edition,
    material.data.subcategory,
    deriveSubcategory(material.id),
    ...(material.data.subcategories ?? []),
  ];

  return [...new Set([...(material.data.tags ?? []), ...derived].filter(Boolean))];
}

export function normalizeTopic(topic: TopicLike): NormalizedTopic {
  return {
    id: topic.id,
    title: topic.data.title,
    description: topic.data.description,
    summary: topic.data.summary ?? topic.data.description,
    order: topic.data.order ?? 0,
    status: topic.data.status ?? 'published',
  };
}

export function normalizeMaterial(material: MaterialLike, topicTitle: string): NormalizedMaterial {
  const year = material.data.year ?? material.data.publishedDate.getFullYear();
  const subcategory = material.data.subcategory ?? deriveSubcategory(material.id);

  return {
    id: material.id,
    title: material.data.title,
    description: material.data.description ?? material.data.summary ?? 'Material institucional da CGEMP.',
    topicId: material.data.topicId,
    topicTitle,
    downloadUrl: material.data.downloadUrl,
    thumbnail: material.data.thumbnail ?? DEFAULT_THUMBNAIL,
    tags: buildMaterialTags(material, topicTitle),
    year,
    edition: material.data.edition,
    subcategory,
    order: material.data.order ?? 0,
    published: material.data.published !== false,
    publishedDate: material.data.publishedDate,
    sourceName: material.data.sourceName,
    sourceType: material.data.sourceType,
  };
}
