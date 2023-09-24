import { program } from "commander";
import { spawn, exec } from "child_process";
import packageData from "../package.json";
import updateNotifier from "update-notifier";
import Logger from "./class/Logger";
import Inquirer from "./class/Inquirer";
import path from "path";
import fs from "fs";
import os from "os";

program
  .name("cook")
  .version(packageData.version)
  .description("Simple tool for creating new projects.")
  .parse(process.argv);

const logger = new Logger();
const inquirer = new Inquirer();

(async () => {
  logger.showLogo();

  let folder = "";
  let name = "";
  let useGit = false;
  let useVscode = false;

  try {
    folder = await inquirer.selectFolder();
    name = await inquirer.inputProjectName();
    useGit = await inquirer.initWithGit();
    useVscode = await inquirer.openWithVscode();
  } catch {
    // Ignore user force close (Ctr+C) for now.
    return process.exit(1);
  }

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

  updateNotifier({ pkg: packageData }).notify();

  return process.exit(0);
})();
