import dotenv from "dotenv";

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "coolIssuer";
const SERVER_TOKEN_SECRET = process.env.JWT_SECRET || "superencryptedsecret";

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_HOST = process.env.MONGO_HOST || "mongodb://127.0.0.1:27017/3waychess";

const MONGO = {
  hostname: MONGO_HOST,
  options: MONGO_OPTIONS,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  url: MONGO_USERNAME && MONGO_PASSWORD ? `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}` : `mongodb://${MONGO_HOST}`,
};

export default {
  server: {
    token: {
      expireTime: SERVER_TOKEN_EXPIRETIME,
      issuer: SERVER_TOKEN_ISSUER,
      secret: SERVER_TOKEN_SECRET,
    },
  },
  mongo: MONGO,
};
