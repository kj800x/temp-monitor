import chalk, { Chalk } from "chalk";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";

const colors: { [key: string]: Chalk } = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

prefix.reg(log);
log.enableAll();

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()]!(
      level
    )}${chalk.green(name !== "root" ? ` ${name}` : "")}:`;
  },
});

prefix.apply(log.getLogger("critical"), {
  format(level, name, timestamp) {
    return chalk.red.bold(`[${timestamp}] ${level} ${name}:`);
  },
});
