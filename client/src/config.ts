import { IConfig } from "types/config";

const dev: IConfig = {
  ENABLE_SENTRY: false,
  SENTRY_DSN: "",
  SENTRY_ENV: "",
};

const prod: IConfig = {
  ENABLE_SENTRY: true,
  SENTRY_DSN: "",
  SENTRY_ENV: "",
};

const test: IConfig = {
  ENABLE_SENTRY: false,
  SENTRY_DSN: "",
  SENTRY_ENV: "",
};

let tempConfig = dev;

if (process.env.NODE_ENV === "production") {
  tempConfig = prod;
}

if (process.env.NODE_ENV === "test") {
  tempConfig = test;
}
const config = tempConfig;

export default config;
