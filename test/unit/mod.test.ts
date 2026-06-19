// deno-lint-ignore-file require-await, no-unused-vars
import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { tools } from '../../mod.ts';
import type { PluginContext } from 'cortex/plugins';

const ctx: PluginContext = {
  pluginId: 'cortex-plugin-hexstrike',
  pluginDir: '/tmp/test',
  state: { get: async () => null, set: async () => {} },
  config: {},
  logger: { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} },
};
const find = (n: string) => tools.find((t) => t.definition.name === n)!;

for (const t of tools) {
  Deno.test(`${t.definition.name} — returns success`, async () => {
    const args: Record<string, unknown> = {};
    for (const p of t.definition.params) {
      if (p.required) {
        if (p.enum) args[p.name] = (p.enum as string[])[0];
        else if (p.type === 'string') args[p.name] = 'test-value';
        else if (p.type === 'number') args[p.name] = 10;
        else if (p.type === 'boolean') args[p.name] = true;
      }
    }
    const r = await t.execute(args, ctx);
    assertEquals(r.success, true);
  });
}

Deno.test('pentest_scan — rejects empty target', async () => {
  const r = await find('pentest_scan').execute({ target: '' }, ctx);
  assertEquals(r.success, false);
});

Deno.test('tools array — has 5 tools', () => {
  assertEquals(tools.length, 5);
});
