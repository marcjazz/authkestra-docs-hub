import { MetadataRoute } from 'next';
import { source } from 'lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://authkestra.js.org'; // Placeholder

  const docs = source.getPages().map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new URLSearchParams().get('dummy') ? new Date() : new Date(), // In a real CI, you'd use git commit time
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    ...docs,
  ];
}
