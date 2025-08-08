import MainService from "@/services/main.service";
import { NextFunction, Request, Response } from "express";

class IndexController {
  public mainService = new MainService();

  //LANDING
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render("index", {
        googl_map_key: process.env.GOOGLE_MAP_KEY,
        nonce: res.locals.nonce,
      });
    } catch (error) {
      next(error);
    }
  };

  //QUOTATION
  public quotation = async (req: any, res: Response, next: NextFunction) => {
    try {
      const response = await this.mainService.quotation({
        ...req.body,
        ip: req.ip,
        device: `${req.useragent.platform
          .trim()
          .toLowerCase()
          .replace(" ", "-")}--${req.useragent.version}--${req.useragent.browser
          .trim()
          .toLowerCase()
          .replace(" ", "-")}`,
      });
      res.status(200).json({ message: "success", data: response });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
