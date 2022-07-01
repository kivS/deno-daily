import { sample } from './deps.ts';


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
];

const random_lib = sample(std_libs);
if(!random_lib) throw Error("No lib found");

const random_topic = sample(random_lib.topics);

console.log(random_lib?.name)
console.log(random_topic?.name)