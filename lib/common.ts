import { Command } from "commander";

export default function initialize(
  program: Command,
) {
  Deno.addSignalListener("SIGINT", () => {
    console.log("-stop-");
    Deno.exit(255);
  });
  program.parse();
}
