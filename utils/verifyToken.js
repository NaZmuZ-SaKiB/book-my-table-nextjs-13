import jwt from "jsonwebtoken";
import { promisify } from "util";

export default async function verifyToken(token) {
  try {
    const decoded = await promisify(jwt.verify)(
      token,
      // eslint-disable-next-line no-undef
      process.env.TOKEN_SECRET
    );

    return decoded;
  } catch (error) {
    return 401;
  }
}
