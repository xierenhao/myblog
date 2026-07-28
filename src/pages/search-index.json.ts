import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

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

    return {
      slug: post.slug,
      title: post.data.title,
      excerpt: post.data.excerpt,
      category: post.data.category,
      date: post.data.date.toISOString().split('T')[0],
      collection: post.data.collection || null,
      content: body.substring(0, 800),
    };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
