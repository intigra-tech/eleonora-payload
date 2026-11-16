import { isMedia, srcOf, srcSet } from '@/lib/payload'

export function Img({
  media, sizes = '100vw', className, priority, size = 'card',
}: { media: unknown; sizes?: string; className?: string; priority?: boolean; size?: 'thumb' | 'card' | 'large' }) {
  if (!isMedia(media)) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcOf(media, size)}
      srcSet={srcSet(media)}
      sizes={sizes}
      alt={media.alt || ''}
      width={media.width || undefined}
      height={media.height || undefined}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
