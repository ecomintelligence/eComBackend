import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  password_salt_round: process.env.PASSWORD_SALT_ROUND,
  db:{
    master_db_url: process.env.MASTER_DB_URL,
    base_db_url: process.env.BASE_DB_URL,
  },
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
  jwt: {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN
  },
};
