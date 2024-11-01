import { Application, esbuild } from "./deps.ts";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.0";
// Transpile jsx to js for React.
try {
  const output = await esbuild.build({
    plugins: [...denoPlugins({
      loader: "native",
    })],
    entryPoints: ["./examples/src/index.tsx"],
    write: false,
    bundle: true,
    format: "iife",
    absWorkingDir: Deno.cwd(),
    jsx: "automatic",
  });
  // The raw transpiled output as a string.
  const indexJs = new TextDecoder().decode(output.outputFiles[0].contents);

  // Setup server.
  const app = new Application();

  // Return transpiled script as HTML string.
  app.use((ctx) => {
    ctx.response.body = `
    <!doctype html>
    <html>
      <head>
        <title>Deno x React</title>
      </head>
      <body>
        <div id="root" />
        <script>${indexJs}</script>
      </body>
    </html>
  `;
  });

  // Start server.
  console.log("Listening on http://localhost:8000");
  await app.listen({ port: 8000 });
} catch (e) {
  console.error(e);
}
