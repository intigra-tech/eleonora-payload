import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: { cpus: 1, webpackMemoryOptimizations: true },
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/:path*', has: [{ type: 'host', value: 'www.eleonorarighi.com' }], destination: 'https://eleonorarighi.com/:path*', permanent: true },
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/:name(page|post|portfolio|portfolio-item|category|portfolio-category)-sitemap:n(\\d*).xml', destination: '/sitemap.xml', permanent: true },
      { source: '/portfolio-item', destination: '/progetti', permanent: true },
      { source: '/portfolio-category', destination: '/progetti', permanent: true },
      { source: '/hello-world', destination: '/', permanent: true },
      { source: '/hello-world-2', destination: '/', permanent: true },
      { source: '/category/uncategorized', destination: '/', permanent: true },
      { source: '/author/gimondi', destination: '/', permanent: true },
    ]
  },
  webpack: (c) => {
    c.resolve.extensionAlias = { '.cjs': ['.cts', '.cjs'], '.js': ['.ts', '.tsx', '.js', '.jsx'], '.mjs': ['.mts', '.mjs'] }
    return c
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
