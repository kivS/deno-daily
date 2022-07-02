import { blue, bold, green, sample, yellow } from "./deps.ts";

interface StdLibs {
  name: string;
  description: string;
  topics: Array<{
    name: string;
    link: string;
  }>;
}

const std_libs: StdLibs[] = [
  {
    name: "archive",
    description: "",
    topics: [
      {
        name: "Tar",
        link: "https://github.com/denoland/deno_std/tree/main/archive#tar",
      },
      {
        name: "Untar",
        link: "https://github.com/denoland/deno_std/tree/main/archive#untar",
      },
    ],
  },
  {
    name: "async",
    description: "async is a module to provide help with asynchronous tasks.",
    topics: [
      {
        name: "abortable",
        link: "https://github.com/denoland/deno_std/tree/main/async#abortable",
      },
      {
        name: "abortablePromise",
        link:
          "https://github.com/denoland/deno_std/tree/main/async#abortablepromise",
      },
      {
        name: "abortableAsyncIterable",
        link:
          "https://github.com/denoland/deno_std/tree/main/async#abortableasynciterable",
      },
      {
        name: "debounce",
        link: "https://github.com/denoland/deno_std/tree/main/async#debounce",
      },
      {
        name: "deferred",
        link: "https://github.com/denoland/deno_std/tree/main/async#deferred",
      },
      {
        name: "delay",
        link: "https://github.com/denoland/deno_std/tree/main/async#delay",
      },
      {
        name: "MuxAsyncIterator",
        link:
          "https://github.com/denoland/deno_std/tree/main/async#muxasynciterator",
      },
      {
        name: "pooledMap",
        link: "https://github.com/denoland/deno_std/tree/main/async#pooledmap",
      },
      {
        name: "tee",
        link: "https://github.com/denoland/deno_std/tree/main/async#tee",
      },
      {
        name: "deadline",
        link: "https://github.com/denoland/deno_std/tree/main/async#deadline",
      },
    ],
  },
  {
    name: "bytes",
    description:
      "Provides helper functions to manipulate Uint8Array byte slices that are not included on the Uint8Array prototype.",
    topics: [
      {
        name: "concat",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/concat",
      },
      {
        name: "copy",
        link: "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/copy",
      },
      {
        name: "endsWith",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/endsWith",
      },
      {
        name: "equals",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/equals",
      },
      {
        name: "includesNeedle",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/includesNeedle",
      },
      {
        name: "indexOfNeedle",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/indexOfNeedle",
      },
      {
        name: "lastIndexOfNeedle",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/lastIndexOfNeedle",
      },
      {
        name: "repeat",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/repeat",
      },
      {
        name: "startsWith",
        link:
          "https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/startsWith",
      },
    ],
  },
  {
    name: "collections",
    description:
      "This module includes pure functions for specific common tasks around collection types like Array and Record.",
    topics: [
      {
        name: "aggregateGroups",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#aggregategroups",
      },
      {
        name: "associateBy",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#associateby",
      },
      {
        name: "associateWith",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#associatewith",
      },
      {
        name: "chunk",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#chunk",
      },
      {
        name: "deepMerge",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#deepmerge",
      },
      {
        name: "distinctBy",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#distinctby",
      },
      {
        name: "distinct",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#distinct",
      },
      {
        name: "dropWhile",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#dropwhile",
      },
      {
        name: "dropLastWhile",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#droplastwhile",
      },
      {
        name: "filterEntries",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#filterentries",
      },
      {
        name: "filterKeys",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#filterkeys",
      },
      {
        name: "filterValues",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#filtervalues",
      },
      {
        name: "findSingle",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#findsingle",
      },
      {
        name: "firstNotNullishOf",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#firstnotnullishof",
      },
      {
        name: "groupBy",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#groupby",
      },
      {
        name: "includesValue",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#includesvalue",
      },
      {
        name: "intersect",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#intersect",
      },
      {
        name: "joinToString",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#jointostring",
      },
      {
        name: "mapEntries",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#mapentries",
      },
      {
        name: "mapKeys",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#mapkeys",
      },
      {
        name: "mapNotNullish",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#mapnotnullish",
      },
      {
        name: "mapValues",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#mapvalues",
      },
      {
        name: "maxBy",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#maxby",
      },
      {
        name: "maxOf",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#maxof",
      },
      {
        name: "maxWith",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#maxwith",
      },
      {
        name: "minBy",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#minby",
      },
      {
        name: "minOf",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#minof",
      },
      {
        name: "minWith",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#minwith",
      },
      {
        name: "partition",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#partition",
      },
      {
        name: "permutations",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#permutations",
      },
      {
        name: "reduceGroups",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#reducegroups",
      },
      {
        name: "runningReduce",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#runningreduce",
      },
      {
        name: "sumOf",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#sumof",
      },
      {
        name: "sample",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#sample",
      },
      {
        name: "slidingWindows",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#slidingwindows",
      },
      {
        name: "sortBy",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#sortby",
      },
      {
        name: "takeLastWhile",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#takelastwhile",
      },
      {
        name: "takeWhile",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#takewhile",
      },
      {
        name: "union",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#union",
      },
      {
        name: "unzip",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#unzip",
      },
      {
        name: "withoutAll",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#withoutall",
      },
      {
        name: "zip",
        link: "https://github.com/denoland/deno_std/tree/main/collections#zip",
      },
      {
        name: "BinaryHeap",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#binaryheap",
      },
      {
        name: "BinarySearchTree",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#binarysearchtree",
      },
      {
        name: "RedBlackTree",
        link:
          "https://github.com/denoland/deno_std/tree/main/collections#redblacktree",
      },
    ],
  },
];

const random_lib = sample(std_libs);
if (!random_lib) throw Error("No lib found");

const random_topic = sample(random_lib.topics);
if (!random_topic) throw Error("No topic found");

console.log(
  `\n${bold(yellow('Today'))} we're going to learn about ${
    bold(green(random_topic.name))
  } from the ${bold(blue(random_lib.name))} library.`,
);
console.log(`\n${bold(blue(random_lib.name))}: ${random_lib.description}`);
console.log(`\n${bold(green(random_topic.name))}: ${random_topic.link}`);
console.log(`\n${bold(yellow("Happy learnings!"))}\n`);
