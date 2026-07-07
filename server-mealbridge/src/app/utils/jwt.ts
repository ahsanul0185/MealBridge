import jwt from "jsonwebtoken";
import config from "../config/env.js";
import { IAuthUser } from "../middleware/checkAuth.js";

export const generateToken = (payload: IAuthUser): string => {
  return jwt.sign(payload, config.jwt_secret, {
    expiresIn: config.jwt_expires_in as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): IAuthUser => {
  return jwt.verify(token, config.jwt_secret) as IAuthUser;
};
