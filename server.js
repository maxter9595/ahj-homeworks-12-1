require('dotenv').config();

const Koa = require("koa");
const Router = require("koa-router");
const slow = require("koa-slow");

class NewsApiServer {
  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.newsData = require("./src/mocks/news.json");
    this.port = process.env.PORT || 3000;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(async (ctx, next) => {
      if (ctx.path === "/serviceWorker/sw.js") {
        ctx.set("Service-Worker-Allowed", "/");
      }
      await next();
    });
    this.app.use(slow({ delay: 2000 }));
  }

  setupRoutes() {
    this.router.get("/api/news", (ctx) => {
      console.log("Получен запрос на /api/news");
      try {
        ctx.body = this.newsData;
        ctx.status = 200;
      } catch (error) {
        console.error("Ошибка при обработке /api/news:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
      }
    });

    this.router.get("/api/cache-resources", (ctx) => {
      ctx.body = {
        resources: [
          "/",
          "/index.html",
          "/bundle.js",
          "/manifest.json",
          "/mocks/news.json",
          "/assets/icons/icon-192x192.png",
          "/assets/icons/icon-512x512.png",
          ...this.getNewsImages(),
        ],
      };
    });

    this.router.get("/mocks/news.json", (ctx) => {
      try {
        ctx.body = this.newsData;
        ctx.type = "application/json";
        ctx.status = 200;
      } catch (error) {
        ctx.status = 500;
        ctx.body = {
          error: "Failed to load mock data",
          message: error.message,
        };
      }
    });

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  getNewsImages() {
    return this.newsData.map((item) => item.image);
  }

  start() {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

const apiServer = new NewsApiServer();
apiServer.start();
