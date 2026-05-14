import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 5190);
const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".md": "text/markdown;charset=utf-8",
};

createServer((request, response) => {
  const rawPath = request.url?.split("?")[0] || "/";
  const safePath = normalize(rawPath).replace(/^([/\\]*\.\.[/\\]*)+/, "");
  const filePath = join(root, safePath === "/" ? "index.html" : safePath);
  const target = existsSync(filePath) ? filePath : join(root, "index.html");

  response.writeHead(200, {
    "content-type": types[extname(target)] || "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(target).pipe(response);
}).listen(port, () => {
  console.log(`AUDD PayLink Lite demo running at http://localhost:${port}`);
});
