// The site's result for a STEP file, for the FreeCAD smoke test to compare against:
// web/step.js tessellation (occt-import-js, STEP_PARAMS) -> the plugins' entry.
//   deno run -A plugins/freecad/tests/site_step.js <file.step> <x-degrees>
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const WEB = new URL('../../../web/', import.meta.url).href;
const { stepObjects, STEP_PARAMS } = await import(`${WEB}step.js`);
const { computeFins } = await import('../../shared/engine/fins_entry.js');
const { reportLine } = await import('../../shared/engine/report.js');
const { pose } = await import('../../cli/cli.js');
const OCCT = fileURLToPath(new URL('vendor/occt-import-js-0.0.23/', WEB));
const occt = await createRequire(import.meta.url)(`${OCCT}occt-import-js.js`)(
  { wasmBinary: Deno.readFileSync(`${OCCT}occt-import-js.wasm`) });
const [file, deg] = Deno.args;
const { objects } = stepObjects(occt.ReadStepFile(Deno.readFileSync(file), STEP_PARAMS));
const soup = objects.flatMap((o) => Array.from(o.positions));
console.log(reportLine(computeFins(pose(soup, [Number(deg), 0, 0])).stats));
