import "../logSetup";
import { backup } from "./backup";
import log from "loglevel";
import { generateToken } from "./generate-token";

async function main() {
  const command = process.argv[2];
  switch (command) {
    case "backup": {
      await backup(process.argv[3]);
      return;
    }
    case "generate-token": {
      generateToken();
      return;
    }
    case "help": {
      const usage = log.getLogger("usage");
      usage.info(`usage:`);
      usage.info(`  bend cli COMMAND`);
      usage.info(``);
      usage.info(`commands:`);
      usage.info(`  backup [LABEL]`);
      return;
    }
    default: {
      if (!command) {
        log.error(
          `Expected "bend cli COMMAND". You did not provide a command to run.`
        );
      } else {
        log.error(`Unknown command: ${command}`);
      }
      process.exit(1);
    }
  }
}

main().catch(log.error);
