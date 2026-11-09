import { createServer } from "node:http";
import { resolve } from "node:path";
import { networkInterfaces } from "node:os";
import { staticHandler } from "./static-server.mjs";
const port = Number(process.env.PORT || process.argv[2] || 3001);
const server = createServer(staticHandler(resolve("out")));
server.listen(port, "0.0.0.0", () => {
  console.log(`Ritik production preview: http://localhost:${port}`);
  for (const entries of Object.values(networkInterfaces()))
    for (const entry of entries || [])
      if (entry.family === "IPv4" && !entry.internal)
        console.log(`Network: http://${entry.address}:${port}`);
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
