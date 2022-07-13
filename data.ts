import { DB } from "./deps.ts";
import { DB_PATH } from "./settings.ts";

interface Topic {
  id: number;
  name: string;
  link: string;
  is_completed: boolean;
  lib_id: number;
}

interface Library {
  name: string;
  description?: string;
}

export class Model {
  db: DB;

  constructor() {
    this.db = new DB(DB_PATH);
  }

  init_db() {
    this.db.execute(`
        CREATE TABLE IF NOT EXISTS std_libs (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
    
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY,
            name TEXT,
            link TEXT UNIQUE,
            lib_id INTEGER REFERENCES std_libs(id) ON DELETE CASCADE ON UPDATE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

      
        CREATE TABLE IF NOT EXISTS topics_completed(
          topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE ON UPDATE CASCADE,
          is_completed INT DEFAULT 0,
          completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );     

        CREATE TABLE configs(
          seeding_completed INT DEFAULT 0
        );
        INSERT INTO configs(seeding_completed) VALUES(0);

    `);
  }

  get_random_topic(): Topic | null {
    const query = this.db.query(`
      -- get random topic from all libs except the ones we've already seen.
      SELECT
          topics.id,
          topics.name,
          topics.link,
          IFNULL(topics_completed.is_completed, 0) as is_completed,
          topics.lib_id
      FROM
          topics
          LEFT JOIN topics_completed ON topics.id = topics_completed.topic_id
      WHERE
          IFNULL(topics_completed.is_completed, 0) = 0
      ORDER BY
          random()
      LIMIT 1;
  `);

    if (query.length === 0) return null;

    const [id, name, link, is_completed, lib_id] = query[0];

    return {
      id: id as number,
      name: String(name),
      link: String(link),
      is_completed: Boolean(is_completed),
      lib_id: lib_id as number,
    };
  }

  get_lib(lib_id: number): Library | null {
    const query = this.db.query(
      `
        SELECT
            name,
            description
        FROM
            std_libs
        WHERE
            id = ?
    `,
      [lib_id],
    );

    if (query.length === 0) return null;

    const [name, description] = query[0];

    return {
      name: String(name),
      description: description ? String(description) : "",
    };
  }

  complete_topic(topic_id: number) {
    return this.db.query(
      `
        INSERT INTO topics_completed (topic_id, is_completed) VALUES (?, 1)
    `,
      [topic_id],
    );
  }

  reset_completed_topics() {
    return this.db.query(`
        DELETE FROM topics_completed
    `);
  }

  get_configs_from_db() {
    for (
      const [seeding_completed] of this.db.query(`
        SELECT
            seeding_completed
        FROM
            configs
    `)
    ) {
      return { seeding_completed: Boolean(seeding_completed) };
    }
  }

  set_seeding_to_complete() {
    return this.db.query(`
        UPDATE configs SET seeding_completed = 1
    `);
  }

  seed_libs() {
    this.db.execute(`
    INSERT INTO "std_libs" ("id", "name", "description") VALUES
    ('1', 'archive', 'Provides helpers for archiving and unarchiving files and directories.'),
    ('2', 'async', 'async is a module to provide help with asynchronous tasks.'),
    ('3', 'bytes', 'Provides helper functions to manipulate Uint8Array byte slices that are not included on the Uint8Array prototype.'),
    ('4', 'collections', 'This module includes pure functions for specific common tasks around collection types like Array and Record.')

    ON CONFLICT(name) DO UPDATE SET description = excluded.description WHERE EXCLUDED.description != description;
  `);
  }

  seed_topics() {
    this.db.execute(`
    INSERT INTO "topics" ("name", "link", "lib_id") VALUES
    -- archive
    ('Tar', 'https://github.com/denoland/deno_std/tree/main/archive#tar', '1'),
    ('Untar', 'https://github.com/denoland/deno_std/tree/main/archive#untar', '1'),

    -- async
    ('abortable', 'https://github.com/denoland/deno_std/tree/main/async#abortable', '2'),
    ('abortablePromise', 'https://github.com/denoland/deno_std/tree/main/async#abortablepromise', '2'),
    ('abortableAsyncIterable', 'https://github.com/denoland/deno_std/tree/main/async#abortableasynciterable', '2'),
    ('debounce', 'https://github.com/denoland/deno_std/tree/main/async#debounce', '2'),
    ('deferred', 'https://github.com/denoland/deno_std/tree/main/async#deferred', '2'),
    ('delay', 'https://github.com/denoland/deno_std/tree/main/async#delay', '2'),
    ('MuxAsyncIterator', 'https://github.com/denoland/deno_std/tree/main/async#muxasynciterator', '2'),
    ('pooledMap', 'https://github.com/denoland/deno_std/tree/main/async#pooledmap', '2'),
    ('tee', 'https://github.com/denoland/deno_std/tree/main/async#tee', '2'),
    ('deadline', 'https://github.com/denoland/deno_std/tree/main/async#deadline', '2'),
    
    -- bytes
    ('concat', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/concat', '3'),
    ('copy', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/copy', '3'),
    ('endsWith', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/endsWith', '3'),
    ('equals', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/equals', '3'),
    ('includesNeedle', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/includesNeedle', '3'),
    ('indexOfNeedle', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/indexOfNeedle', '3'),
    ('lastIndexOfNeedle', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/lastIndexOfNeedle', '3'),
    ('repeat', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/repeat', '3'),
    ('startsWith', 'https://doc.deno.land/https://deno.land/std/bytes/mod.ts/~/startsWith', '3'),
    
    -- collections
    ('aggregateGroups', 'https://github.com/denoland/deno_std/tree/main/collections#aggregategroups', '4'),
    ('associateBy', 'https://github.com/denoland/deno_std/tree/main/collections#associateby', '4'),
    ('associateWith', 'https://github.com/denoland/deno_std/tree/main/collections#associatewith', '4'),
    ('chunk', 'https://github.com/denoland/deno_std/tree/main/collections#chunk', '4'),
    ('deepMerge', 'https://github.com/denoland/deno_std/tree/main/collections#deepmerge', '4'),
    ('distinctBy', 'https://github.com/denoland/deno_std/tree/main/collections#distinctby', '4'),
    ('distinct', 'https://github.com/denoland/deno_std/tree/main/collections#distinct', '4'),
    ('dropWhile', 'https://github.com/denoland/deno_std/tree/main/collections#dropwhile', '4'),
    ('dropLastWhile', 'https://github.com/denoland/deno_std/tree/main/collections#droplastwhile', '4'),
    ('filterEntries', 'https://github.com/denoland/deno_std/tree/main/collections#filterentries', '4'),
    ('filterKeys', 'https://github.com/denoland/deno_std/tree/main/collections#filterkeys', '4'),
    ('filterValues', 'https://github.com/denoland/deno_std/tree/main/collections#filtervalues', '4'),
    ('findSingle', 'https://github.com/denoland/deno_std/tree/main/collections#findsingle', '4'),
    ('firstNotNullishOf', 'https://github.com/denoland/deno_std/tree/main/collections#firstnotnullishof', '4'),
    ('groupBy', 'https://github.com/denoland/deno_std/tree/main/collections#groupby', '4'),
    ('includesValue', 'https://github.com/denoland/deno_std/tree/main/collections#includesvalue', '4'),
    ('intersect', 'https://github.com/denoland/deno_std/tree/main/collections#intersect', '4'),
    ('joinToString', 'https://github.com/denoland/deno_std/tree/main/collections#jointostring', '4'),
    ('mapEntries', 'https://github.com/denoland/deno_std/tree/main/collections#mapentries', '4'),
    ('mapKeys', 'https://github.com/denoland/deno_std/tree/main/collections#mapkeys', '4'),
    ('mapNotNullish', 'https://github.com/denoland/deno_std/tree/main/collections#mapnotnullish', '4'),
    ('mapValues', 'https://github.com/denoland/deno_std/tree/main/collections#mapvalues', '4'),
    ('maxBy', 'https://github.com/denoland/deno_std/tree/main/collections#maxby', '4'),
    ('maxOf', 'https://github.com/denoland/deno_std/tree/main/collections#maxof', '4'),
    ('maxWith', 'https://github.com/denoland/deno_std/tree/main/collections#maxwith', '4'),
    ('minBy', 'https://github.com/denoland/deno_std/tree/main/collections#minby', '4'),
    ('minOf', 'https://github.com/denoland/deno_std/tree/main/collections#minof', 4),
    ('minWith', 'https://github.com/denoland/deno_std/tree/main/collections#minwith', 4),
    ('partition', 'https://github.com/denoland/deno_std/tree/main/collections#partition', 4),
    ('permutations', 'https://github.com/denoland/deno_std/tree/main/collections#permutations', 4),
    ('reduceGroups', 'https://github.com/denoland/deno_std/tree/main/collections#reducegroups', 4),
    ('runningReduce', 'https://github.com/denoland/deno_std/tree/main/collections#runningreduce', 4),
    ('sumOf', 'https://github.com/denoland/deno_std/tree/main/collections#sumof', 4),
    ('sample', 'https://github.com/denoland/deno_std/tree/main/collections#sample', 4),
    ('slidingWindows', 'https://github.com/denoland/deno_std/tree/main/collections#slidingwindows', 4),
    ('sortBy', 'https://github.com/denoland/deno_std/tree/main/collections#sortby', 4),
    ('takeLastWhile', 'https://github.com/denoland/deno_std/tree/main/collections#takelastwhile', 4),
    ('takeWhile', 'https://github.com/denoland/deno_std/tree/main/collections#takewhile', 4),
    ('union', 'https://github.com/denoland/deno_std/tree/main/collections#union', 4),
    ('unzip', 'https://github.com/denoland/deno_std/tree/main/collections#unzip', 4),
    ('withoutAll', 'https://github.com/denoland/deno_std/tree/main/collections#withoutall', 4),
    ('zip', 'https://github.com/denoland/deno_std/tree/main/collections#zip', 4),
    ('BinaryHeap', 'https://github.com/denoland/deno_std/tree/main/collections#binaryheap', 4),
    ('BinarySearchTree', 'https://github.com/denoland/deno_std/tree/main/collections#binarysearchtree', 4),
    ('RedBlackTree', 'https://github.com/denoland/deno_std/tree/main/collections#redblacktree', 4)
    
    ON CONFLICT(link) DO NOTHING;
  `);
  }
}
