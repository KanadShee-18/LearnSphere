import winston from "winston";
import chalk from "chalk";

const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(chalk.blue("[INFO]"), message, ...args);
  },

  warn: (message: string, ...args: any[]) => {
    console.log(chalk.yellowBright("[WARN]"), message, ...args);
  },

  error: (message: string, ...args: any[]) => {
    console.log(chalk.redBright("[ERROR]"), message, ...args);
  },

  debug: (message: string, ...args: any[]) => {
    console.log(chalk.cyanBright("[DEBUG]"), message, ...args);
  },
};

export default logger;
