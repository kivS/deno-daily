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
  {
    name: 'bytes',
    description: 'Provides helper functions to manipulate Uint8Array byte slices that are not included on the Uint8Array prototype.',
    topics: [
      {
        name: 'concat',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/concat'
      },
      {
        name: 'copy',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/copy'
      },
       {
        name: 'endsWith',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/endsWith'
      },
       {
        name: 'equals',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/equals'
      },
       {
        name: 'includesNeedle',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/includesNeedle'
      },
       {
        name: 'indexOfNeedle',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/indexOfNeedle'
      },
       {
        name: 'lastIndexOfNeedle',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/lastIndexOfNeedle'
      },
       {
        name: 'repeat',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/repeat'
      },
       {
        name: 'startsWith',
        link: 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/startsWith'
      },
    ]
  },
  {
    name: 'collections',
    description: 'This module includes pure functions for specific common tasks around collection types like Array and Record.',
    topics: [
        {
            name: 'aggregateGroups',
            link: 'https://github.com/denoland/deno_std/tree/main/collections#aggregategroups'
        },
        {
            name: '',
            link: ''
        },
    ]
  }
];

const random_lib = sample(std_libs);
if(!random_lib) throw Error("No lib found");

const random_topic = sample(random_lib.topics);

console.log(random_lib?.name)
console.log(random_topic?.name)