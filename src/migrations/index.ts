import * as migration_20261116_000754_initial from './20261116_000754_initial';
import * as migration_20261116_101801_schede_e_banner from './20261116_101801_schede_e_banner';

export const migrations = [
  {
    up: migration_20261116_000754_initial.up,
    down: migration_20261116_000754_initial.down,
    name: '20261116_000754_initial',
  },
  {
    up: migration_20261116_101801_schede_e_banner.up,
    down: migration_20261116_101801_schede_e_banner.down,
    name: '20261116_101801_schede_e_banner'
  },
];
