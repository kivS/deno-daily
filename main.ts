import {
  blue,
  bold,
  emptyDirSync,
  ensureDirSync,
  green,
  parse,
  yellow,
} from "./deps.ts";
import { APP_DATA_PATH } from "./settings.ts";
import { Model } from "./data.ts";

// directory where we'll store our data
ensureDirSync(APP_DATA_PATH);

const data = new Model();

const args = parse(Deno.args);

if (args["help"]) {
  console.log(`
  Usage: deno-daily [--help] [--sync] [--unlearn] [--nuke]

  --help: show this help
  --sync: sync the database with the latest standard libraries data 
  --unlearn: resets the learning topics so we can start over
  --nuke: Reset application and start over fresh
  `);
  Deno.exit(0);
}

try {
  // make sure db has been initialized
  data.get_configs_from_db();
} catch (_) {
  data.init_db();
}

const configs = data.get_configs_from_db();
if (!configs) console.error("no configs"), Deno.exit(1);

if (!configs.seeding_completed) {
  console.log(green(bold("Syncing data...")));
  data.seed_libs();
  data.seed_topics();
  data.set_seeding_to_complete();
}

globalThis.onunload = (_e: Event): void => {
  // console.debug(`${e.type} event - let's clean up everything`);
  if (data.db) data.db.close();
};

if (args["nuke"]) {
  console.log(yellow(bold("Reseting everything!")));
  Deno.removeSync(APP_DATA_PATH, { recursive: true });
  Deno.exit(0);
}

if (args["sync"]) {
  console.log(blue(bold("Syncing data...")));
  data.seed_libs();
  data.seed_topics();
  console.log(green(bold("Done!")));
  Deno.exit(0);
}

if (args["unlearn"]) {
  console.log(yellow(bold("Reseting learned topics...")));
  data.reset_completed_topics();
  Deno.exit(0);
}

const random_topic = data.get_random_topic();

if (!random_topic) {
  console.log(yellow(bold("\nNo more topics left to learn!\n")));
  Deno.exit(0);
}

const std_lib = data.get_lib(random_topic.lib_id);
if (!std_lib) {
  console.error("Error finding library");
  Deno.exit(1);
}

console.log(
  `\n${bold(yellow("Today"))} we're going to learn about ${
    bold(green(random_topic.name))
  } from the ${bold(blue(std_lib.name))} library.`,
);
console.log(`\n${bold(blue(std_lib.name))}: ${std_lib.description ?? ""}`);
console.log(`\n${bold(green(random_topic.name))}: ${random_topic.link}`);
console.log(`\n${bold(yellow("Happy learnings!"))}\n`);

data.complete_topic(random_topic.id);
