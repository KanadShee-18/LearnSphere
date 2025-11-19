import winston from "winston";
import chalk from "chalk";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      const color =
        level === "error"
          ? chalk.red
          : level === "warn"
          ? chalk.yellow
          : chalk.green;

      return `${chalk.gray(timestamp)} ${color(
        level.toUpperCase()
      )}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
