import { OpenAPIHono } from "@hono/zod-openapi";
import { trimTrailingSlash } from "hono/trailing-slash";

interface Bindings {
  [key: string]: string;
}

interface AppEnv {
  Bindings: Bindings;
}

const app = new OpenAPIHono<AppEnv>({ strict: true });

app.use(trimTrailingSlash({ alwaysRedirect: true }));

app.get("/", (c) => {
  return c.text("ok");
});

app.get("/ping", (c) => {
  return c.text("pong");
});

app.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "API Key",
  description:
    "Send your API key in the Authorization header as Bearer API_KEY.",
});

app.doc31("/openapi.json", (_c) => ({
  openapi: "3.1.1",
  info: {
    title: "Repro API",
    version: "1.0.0",
    description: "OpenAPI schema for the Repro API.",
  },
  security: [{ BearerAuth: [] }],
}));

export default app;
