import { app } from "./app.js";
import "dotenv";

app.listen(process.env.PORT, () => {
  console.info("APP START");
});
