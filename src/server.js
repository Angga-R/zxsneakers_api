import { app } from "./app.js";
import "dotenv";
import config from "./config/config.service.js";

app.listen(process.env.PORT, () => {
  console.info("APP START");
  console.info(`RUNNING AT ${config.environtment}`);
});
