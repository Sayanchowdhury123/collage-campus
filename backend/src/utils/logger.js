import dotenv from "dotenv";
dotenv.config();
import winston, { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, json, colorize, printf } = format;

const consoleFormat = printf(({ level, message, timestamp, ...rest }) => {
  let msg = `${timestamp} [${level}] ${message}`;
  const restKeys = Object.keys(rest);
  if (restKeys.length > 0) {
    msg += ` ${JSON.stringify(rest,null,2)}`;
  }
  return msg;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "prod" ? "info" : "debug",
  format: errors({ stack: true }),
  transports: [],
});

if (process.env.NODE_ENV === "prod") {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), json()),
    })
  );
} else {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), colorize({ all: true }), consoleFormat),
    })
  );
}

export default logger;