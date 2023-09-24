import fs from "fs";
import chalk from "chalk";

const ASCII_FILE_PATH = new URL("../../asset/ascii.txt", import.meta.url)
  .pathname;

export default class Logger {
  asciiLogo: string;

  constructor() {
    this.asciiLogo = fs.readFileSync(ASCII_FILE_PATH, "utf8");
  }

  public showLogo() {
    console.log(this.asciiLogo);
  }

  public projectReady(projectPath: string) {
    console.log(chalk.green(`Your new project is ready at ${projectPath}`));
  }

  public handleMkDirError(error: Error) {
    console.error(chalk.red("Unable to create directory."));
    console.error(error.message);
  }

  public handleGitInitError({
    error,
    stderr,
  }: {
    error: Error | null;
    stderr: string | null;
  }) {
    if (error) {
      console.error(chalk.red("Unable to initialize Git."));
      console.error(error.message);
    }

    if (stderr) {
      console.error(chalk.red("Unable to initialize Git."));
      console.error(stderr);
    }
  }

  public handleSpawnCodeError(error: Error) {
    console.error(chalk.red("Unable to open project with VSCode."));
    console.error(error.message);
  }
}
