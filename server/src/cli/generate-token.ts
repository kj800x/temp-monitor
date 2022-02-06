import jwt from "jsonwebtoken";
import { JWT_KEY } from "../env/jwtKey";

import loglevel from "loglevel";
const log = loglevel.getLogger("generate-token");

export const generateToken = () => {
  const token = jwt.sign({ authenticated: true }, JWT_KEY);

  log.info("Authenticated token:");
  log.info(token);
};
