import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://epictravelsblog.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://epictravelsblog.com/blog/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://epictravelsblog.com/about/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
${posts.map((post) => {
  const lastmod = post.data.updated || post.data.date;
  return `  <url>
    <loc>https://epictravelsblog.com/blog/${post.slug}/</loc>
    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
