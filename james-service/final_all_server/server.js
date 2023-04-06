const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const dotenv = require("dotenv");

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.DOMAIN_NAME || "localhost";
const port = process.env.PORT || 3000;
const protocol = process.env.PROTOCOL || "http";

const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      if (pathname === "/Profilepage") {
        await app.render(req, res, "/Profilepage", query);
      } else if (pathname === "/AdminPage") {
        await app.render(req, res, "/AdminPage", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, hostname ,(err) => {
    if (err) throw err;
    console.log(`> Ready on ${protocol}://${hostname}:${port}`);
  });
});
