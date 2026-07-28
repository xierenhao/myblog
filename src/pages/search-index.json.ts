import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderCoverSVG } from '../lib/cover';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');

  const index = posts.map((post) => {
    const body = (post.body || '')
      .replace(/^---[\s\S]+?---/, '')
      .replace(/```[\s\S]+?```/g, ' ')
      .replace(/`[^`]+`/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#>*_~|\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const date = post.data.date;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return {
      slug: post.slug,
      title: post.data.title,
      excerpt: post.data.excerpt,
      category: post.data.category,
      date: date.toISOString().split('T')[0],
      dateShort: `${month}.${day}`,
      collection: post.data.collection || null,
      content: body.substring(0, 800),
      coverSvg: renderCoverSVG(post.data, 'sm'),
    };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
