import * as migration_20261116_000754_initial from './20261116_000754_initial';

export const migrations = [
  {
    up: migration_20261116_000754_initial.up,
    down: migration_20261116_000754_initial.down,
    name: '20261116_000754_initial'
  },
];
