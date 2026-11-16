import * as migration_20261116_000754_initial from './20261116_000754_initial';
import * as migration_20261116_101801_schede_e_banner from './20261116_101801_schede_e_banner';
import * as migration_20261116_105755_mcp_bozze_ruoli from './20261116_105755_mcp_bozze_ruoli';
import * as migration_20261116_124309_tool_upload from './20261116_124309_tool_upload';
import * as migration_20261116_141706_seo_plugin from './20261116_141706_seo_plugin';

export const migrations = [
  {
    up: migration_20261116_000754_initial.up,
    down: migration_20261116_000754_initial.down,
    name: '20261116_000754_initial',
  },
  {
    up: migration_20261116_101801_schede_e_banner.up,
    down: migration_20261116_101801_schede_e_banner.down,
    name: '20261116_101801_schede_e_banner',
  },
  {
    up: migration_20261116_105755_mcp_bozze_ruoli.up,
    down: migration_20261116_105755_mcp_bozze_ruoli.down,
    name: '20261116_105755_mcp_bozze_ruoli',
  },
  {
    up: migration_20261116_124309_tool_upload.up,
    down: migration_20261116_124309_tool_upload.down,
    name: '20261116_124309_tool_upload',
  },
  {
    up: migration_20261116_141706_seo_plugin.up,
    down: migration_20261116_141706_seo_plugin.down,
    name: '20261116_141706_seo_plugin'
  },
];
