import developmentConfig from "./development.js";
import productionConfig from "./production.js";

const config =
  process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;

export default config;
