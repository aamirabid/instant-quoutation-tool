import { Router } from "express";
import IndexController from "@controllers/index.controller";
import { Routes } from "@interfaces/routes.interface";
import useragentMiddleware from "@/middlewares/user-agent.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { QuoteRequestDTO } from "@/dtos/quote.dto";

class IndexRoute implements Routes {
  public path = "/";
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //LANDING
    this.router.get(
      `${this.path}`,
      useragentMiddleware,
      this.indexController.index
    );

    //QUOTATION
    this.router.post(
      `${this.path}api/quote`,
      validationMiddleware(QuoteRequestDTO, "body"),
      useragentMiddleware,
      this.indexController.quotation
    );
  }
}

export default IndexRoute;
