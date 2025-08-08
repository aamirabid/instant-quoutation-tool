import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import {
  DataStoredInToken,
  RequestWithUserAgent,
} from "@interfaces/auth.interface";

const useragentMiddleware = async (
  req: RequestWithUserAgent,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.useragent) next(new HttpException(404, "User Agent Missing!"));
    req.useragent.link = process.env.LIQA_WEBSITE;
    req.useragent.appUrl = process.env.LIQA_DL_HOST;
    if (
      req.useragent.isMac ||
      req.useragent.isiPhone ||
      req.useragent.isiPad ||
      req.useragent.isiPod ||
      req.useragent.isiPhoneNative ||
      req.useragent.isSafari
    ) {
      req.useragent.link = process.env.LIQA_APPLE_STORE;
    }
    if (
      req.useragent.isAndroid ||
      req.useragent.isAndroidNative ||
      req.useragent.isAndroidTablet ||
      req.useragent.isSamsung ||
      req.useragent.isTablet
    ) {
      req.useragent.link = process.env.LIQA_GOOGLE_PLAY_STORE;
      req.useragent.appUrl = `${req.useragent.appUrl}Agent`;
    }
    next();
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};

export default useragentMiddleware;
