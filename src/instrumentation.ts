export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.SEED_ON_START !== '0') {
    const { seedIfEmpty } = await import('./lib/seed')
    seedIfEmpty().catch((e) => console.error('Seed error', e))
  }
}
