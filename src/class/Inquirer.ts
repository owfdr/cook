import select from "@inquirer/select";
import input from "@inquirer/input";
import confirm from "@inquirer/confirm";

export default class Inquirer {
  public selectFolder() {
    return select({
      message: "Where should the new project go?",
      choices: [
        {
          name: "app",
          value: "app",
          description: "Create a new project in the app folder.",
        },
        {
          name: "test",
          value: "test",
          description: "Create a new project in the test folder.",
        },
        {
          name: "learn",
          value: "learn",
          description: "Create a new project in the learn folder.",
        },
      ],
    });
  }

  public inputProjectName() {
    return input({
      message: "Name of your new project?",
    });
  }

  public initWithGit() {
    return confirm({
      message: "Initialize this project with Git?",
      default: true,
    });
  }

  public openWithVscode() {
    return confirm({
      message: "Open the project with VSCode?",
      default: true,
    });
  }
}
