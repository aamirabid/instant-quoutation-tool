import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import useragent from "express-useragent";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { connect, set } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from "@config";
import { dbConnection } from "@databases";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import { engine } from "express-handlebars";
import path from "path";
import * as crypto from "crypto";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.app.set("trust proxy", true);
    this.app.use(useragent.express());
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;
    this.app.engine("hbs", engine({ extname: ".hbs" }));
    this.app.set("view engine", "hbs");
    this.app.set("views", path.join(__dirname, "views"));
    this.app.use(express.static(path.join(__dirname, "views")));
    //this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      set("debug", true);
    }

    connect(dbConnection.url, dbConnection.options);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(
      helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": [
            "'self'",
            "'unsafe-inline'", // required for inline JS (optional, try to avoid if possible)
            "https://code.jquery.com", // allow jQuery
            "https://maps.googleapis.com", // allow Google Maps API
            "https://maps.gstatic.com", // Google Maps dependencies
          ],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          "img-src": [
            "'self'",
            "data:",
            "https://maps.googleapis.com",
            "https://maps.gstatic.com",
          ],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
        },
      })
    );
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use((req, res, next) => {
      const nonce = Buffer.from(crypto.randomBytes(16)).toString("base64"); // Generate a secure nonce
      res.locals.nonce = nonce;
      res.locals.cspNonce = nonce;
      res.setHeader(
        "Content-Security-Policy",
        `script-src 'self' 'nonce-${res.locals.nonce}'; object-src 'none';`
      );
      next();
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("", route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "REST API",
          version: "1.0.0",
          description: "Instant Quote API Documentation",
        },
      },
      apis: ["swagger.yaml"],
    };

    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
