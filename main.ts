import { blue, bold, green, yellow } from "./deps.ts";
import * as data from "./data.ts";

try{
  // make sure db has been initialized
  data.get_configs();

}catch(_){
    data.init_db();
}

const configs = data.get_configs();

if(!configs.seeding_completed){
    console.debug('seeding data')
    await data.seed_libs();
    await data.seed_topics();
    data.set_seeding_to_complete();
}

globalThis.onunload = (_e: Event): void => {
  // console.debug(`${e.type} event - let's clean up everything`);
  if(data.db) data.db.close();
};


// TODO: add flag to update data
// TODO: add flag to nuke everything, db, directory of files, etc.


const random_topic = data.get_random_topic();

if (!random_topic){
    console.log(yellow(bold("\nNo more topics left to learn!\n")))
    Deno.exit(0);
}

const std_lib = data.get_lib_from_id(random_topic.lib_id);
if (!std_lib){
    console.error('Error finding library')
    Deno.exit(1);
}

console.log(
  `\n${bold(yellow("Today"))} we're going to learn about ${
    bold(green(random_topic.name))
  } from the ${bold(blue(std_lib.name))} library.`,
);
console.log(`\n${bold(blue(std_lib.name))}: ${std_lib.description ?? ''}`);
console.log(`\n${bold(green(random_topic.name))}: ${random_topic.link}`);
console.log(`\n${bold(yellow("Happy learnings!"))}\n`);

data.complete_topic(random_topic.id);

