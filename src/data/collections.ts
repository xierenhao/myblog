export interface CollectionInfo {
  slug: string;
  title: string;
  description: string;
  category: 'ai' | 'football' | 'fragments';
  status: 'ongoing' | 'completed';
  startDate?: string;
}

export const collections: CollectionInfo[] = [
  {
    slug: 'harness',
    title: 'harness 系列',
    description: '从产品经理视角拆解 agent harness——tools、context window、memory 三层结构，以及为什么脚手架比模型本身更重要。',
    category: 'ai',
    status: 'ongoing',
  },
  {
    slug: 'world-cup-2026',
    title: '2026 世界杯复盘',
    description: '从选材到临场逐层拆解法国队为何止步四强——一支靠个人能力硬撑的"野球队伍"。',
    category: 'football',
    status: 'ongoing',
    startDate: '2026-07',
  },
  {
    slug: 'amateur-notes',
    title: '野球笔记',
    description: '业余球员的踢球体感与思考——看球是分析，踢球是执行，两者之间隔着一整个身体能力。',
    category: 'football',
    status: 'ongoing',
    startDate: '2026-05',
  },
];

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getCollectionsByCategory(category: string) {
  return collections.filter((c) => c.category === category);
}
