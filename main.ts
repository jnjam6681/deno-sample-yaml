import { program } from "commander";
import initialize from "./lib/common.ts";

(await import("./lib/programs/export-config.ts")).default(program);

initialize(program);