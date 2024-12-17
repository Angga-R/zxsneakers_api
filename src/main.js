import { web } from "./app/web.js";
global.__basedir = process.cwd();

web.listen(3000, () => {
  console.info("app start");
});
