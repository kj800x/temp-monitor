import jwt from "jsonwebtoken";
import { JWT_KEY } from "../env/jwtKey";

export const generateToken = () => {
  const token = jwt.sign({ authenticated: true }, JWT_KEY);

  console.log("Authenticated token:");
  console.log(token);
};
