import { createServer } from "node:http";
import { resolve } from "node:path";
import { networkInterfaces } from "node:os";
import { staticHandler } from "./static-server.mjs";
import { calendarAvailability } from "../src/shared/integrations/calendar-availability.mjs";
import { calendarBookings } from "../src/shared/integrations/calendar-bookings.mjs";
const port = Number(process.env.PORT || process.argv[2] || 3001);
const serveFile = staticHandler(resolve("out"));
const server = createServer((req, res) => {
  if (req.url.split("?")[0] === "/api/booking/availability") {
    return calendarAvailability(req, res);
  }
  if (req.url.split("?")[0] === "/api/booking/requests")
    return calendarBookings(req, res);
  return serveFile(req, res);
});
server.listen(port, "0.0.0.0", () => {
  console.log(`Ritik production preview: http://localhost:${port}`);
  for (const entries of Object.values(networkInterfaces()))
    for (const entry of entries || [])
      if (entry.family === "IPv4" && !entry.internal)
        console.log(`Network: http://${entry.address}:${port}`);
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
