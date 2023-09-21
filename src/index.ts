import { program } from "commander";
import { spawn, exec } from "child_process";
import Logger from "./class/Logger";
import Inquirer from "./class/Inquirer";
import path from "path";
import fs from "fs";
import os from "os";

program
  .name("cook")
  .version("0.1.0")
  .description("Simple tool for creating new projects.")
  .parse(process.argv);

const logger = new Logger();
const inquirer = new Inquirer();

(async () => {
  logger.showLogo();

  const folder = await inquirer.selectFolder();
  const name = await inquirer.inputProjectName();
  const useGit = await inquirer.initWithGit();
  const useVscode = await inquirer.openWithVscode();

  const home = os.homedir();
  const projectPath = path.join(home, folder, name);

  try {
    fs.mkdirSync(projectPath);
  } catch (error) {
    logger.handleMkDirError(error);
    return process.exit(1);
  }

  if (useGit) {
    const cd = `cd ${projectPath}`;
    const init = `git init`;
    const commit = `git commit --allow-empty -m 'chore: commit nothing'`;

    exec(`${cd}; ${init}; ${commit}`, (error, stderr) => {
      if (error || stderr) {
        logger.handleGitInitError({ error, stderr });
        return process.exit(1);
      }
    });
  }

  if (useVscode) {
    try {
      spawn("code", [projectPath], { stdio: "inherit" });
    } catch (error) {
      logger.handleSpawnCodeError(error);
      return process.exit(1);
    }
  }

  logger.projectReady(projectPath);
  return process.exit(0);
})();
