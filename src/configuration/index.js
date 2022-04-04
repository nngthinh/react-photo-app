import { baseUrlDev } from "./development";
import { baseUrlProd } from "./production";
// process.env.REACT_APP_ENV
export const baseUrl =
  process.env.NODE_ENV === "development" ? baseUrlDev : baseUrlProd;
