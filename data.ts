import { RowObject } from "https://deno.land/x/sqlite@v3.5.0/mod.ts";
import { DB } from "./deps.ts";
import { DB_PATH } from "./settings.ts";

type Topic = {
  id: number;
  name: string;
  link: string;
  is_completed: boolean;
  lib_id: number;
};

type Library = {
  name: string;
  description?: string;
};

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
    ('4', 'collections', 'This module includes pure functions for specific common tasks around collection types like Array and Record.'),
    ('5', 'crypto', 'Library for cryptographic functions.'),
    ('6', 'datetime', 'Simple helper to help parse date strings into Date, with additional functions.'),
    ('7', 'dotenv', 'Library for loading environment variables from a .env file.'),
    ('8', 'encoding', 'Helper module for dealing with external data structures.'),
    ('9', 'flags', 'Command line arguments parser for Deno based on minimist.'),
    ('10', 'fmt', 'Formatting library for Deno.'),
    ('11', 'fs', 'fs module is made to provide helpers to manipulate the filesystem.'),
    ('12', 'http', 'http is a module to provide HTTP client and server implementations.'),
    ('13', 'io', 'io module is made to provide helpers to manipulate the filesystem.'),
    ('14', 'log', ''),
    ('15', 'media_types', 'Provides an API for handling media (MIME) types.'),
    ('16', 'path', 'path module is made to provide helpers to manipulate the path.'),
    ('17', 'signal', 'signal is a module used to capture and monitor OS signals.'),
    ('18', 'streams', ''),
    ('19', 'testing', 'This module provides a few basic utilities to make testing easier and consistent in Deno.'),
    ('20', 'uuid', 'Generate and validate v1, v4, and v5 UUIDs.'),
    ('21', 'wasi', 'This module provides an implementation of the WebAssembly System Interface.'),
    ('22', 'Semver', 'Semver is a library for working with Semantic Versioning (SemVer).')

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
    ('RedBlackTree', 'https://github.com/denoland/deno_std/tree/main/collections#redblacktree', 4),

    -- crypto
    ('digest', 'https://github.com/denoland/deno_std/tree/main/crypto#usage', 5),

    -- datetime
    ('parse', 'https://github.com/denoland/deno_std/tree/main/datetime#parse', 6),
    ('format', 'https://github.com/denoland/deno_std/tree/main/datetime#format', 6),
    ('dayOfYear', 'https://github.com/denoland/deno_std/tree/main/datetime#dayofyear', 6),
    ('weekOfYear', 'https://github.com/denoland/deno_std/tree/main/datetime#weekofyear', 6),
    ('toIMF', 'https://github.com/denoland/deno_std/tree/main/datetime#toimf', 6),
    ('isLeap', 'https://github.com/denoland/deno_std/tree/main/datetime#isleap', 6),
    ('difference', 'https://github.com/denoland/deno_std/tree/main/datetime#difference', 6),
    ('Constants', 'https://github.com/denoland/deno_std/tree/main/datetime#constants', 6),

    -- dotenv
    ('config', 'https://github.com/denoland/deno_std/tree/main/dotenv#usage', 7),
    ('auto-loading', 'https://github.com/denoland/deno_std/tree/main/dotenv#auto-loading', 7),
    ('safe-mode', 'https://github.com/denoland/deno_std/tree/main/dotenv#safe-mode', 7),
    ('default-values', 'https://github.com/denoland/deno_std/tree/main/dotenv#default-values', 7),

    -- encoding
    ('binary', 'https://github.com/denoland/deno_std/tree/main/encoding#binary', 8),
    ('csv', 'https://github.com/denoland/deno_std/tree/main/encoding#csv', 8),
    ('toml', 'https://github.com/denoland/deno_std/tree/main/encoding#toml', 8),
    ('yaml', 'https://github.com/denoland/deno_std/tree/main/encoding#yaml', 8),
    ('JSON streaming', 'https://github.com/denoland/deno_std/tree/main/encoding#json-streaming', 8),
    ('jsonc', 'https://github.com/denoland/deno_std/tree/main/encoding#jsonc', 8),
    ('base32', 'https://github.com/denoland/deno_std/tree/main/encoding#base32', 8),
    ('base64', 'https://github.com/denoland/deno_std/tree/main/encoding#base64', 8),
    ('base64url', 'https://github.com/denoland/deno_std/tree/main/encoding#base64url', 8),
    ('ascii85', 'https://github.com/denoland/deno_std/tree/main/encoding#ascii85', 8),
    ('hex', 'https://github.com/denoland/deno_std/tree/main/encoding#hex', 8),

    -- flags
    ('parse', 'https://github.com/denoland/deno_std/tree/main/flags#example', 9),

    -- fmt
    ('printf', 'https://github.com/denoland/deno_std/tree/main/fmt#printf-prints-formatted-output', 10),
    ('colors', 'https://github.com/denoland/deno_std/tree/main/fmt#colors', 10),
    ('pretty-bytes', 'https://github.com/denoland/deno_std/tree/main/fmt#pretty-bytes', 10),

    -- fs
    ('emptyDir', 'https://github.com/denoland/deno_std/tree/main/fs#emptydir', 11),
    ('ensureDir', 'https://github.com/denoland/deno_std/tree/main/fs#ensuredir', 11),
    ('ensureFile', 'https://github.com/denoland/deno_std/tree/main/fs#ensurefile', 11),
    ('ensureSymlink', 'https://github.com/denoland/deno_std/tree/main/fs#ensuresymlink', 11),
    ('EOL', 'https://github.com/denoland/deno_std/tree/main/fs#eol', 11),
    ('exists', 'https://github.com/denoland/deno_std/tree/main/fs#exists', 11),
    ('copy', 'https://github.com/denoland/deno_std/tree/main/fs#copy', 11),
    ('walk', 'https://github.com/denoland/deno_std/tree/main/fs#walk', 11),
    ('expandGlob', 'https://github.com/denoland/deno_std/tree/main/fs#expandglob', 11),

    -- http
    ('server', 'https://github.com/denoland/deno_std/tree/main/http#server', 12),
    ('file-server', 'https://github.com/denoland/deno_std/tree/main/http#file-server', 12),
    ('http status code and status text', 'https://github.com/denoland/deno_std/tree/main/http#http-status-code-and-status-text', 12),
    ('HTTP errors', 'https://github.com/denoland/deno_std/tree/main/http#http-errors', 12),
    ('Negotiation', 'https://github.com/denoland/deno_std/tree/main/http#negotiation', 12),
    ('Cookie', 'https://github.com/denoland/deno_std/tree/main/http#cookie', 12),


    -- io 
    ('readLines', 'https://github.com/denoland/deno_std/tree/main/io#readlines', 13),
    ('readStringDelim', 'https://github.com/denoland/deno_std/tree/main/io#readstringdelim', 13),
    ('StringReader', 'https://github.com/denoland/deno_std/tree/main/io#stringreader', 13),
    ('StringWriter', 'https://github.com/denoland/deno_std/tree/main/io#stringwriter', 13),

    -- log
    ('log', 'https://github.com/denoland/deno_std/tree/main/log#usage', 14),
    ('inline-logging', 'https://github.com/denoland/deno_std/tree/main/log#inline-logging', 14),
    ('Lazy Log Evaluation', 'https://github.com/denoland/deno_std/tree/main/log#lazy-log-evaluation', 14),

    -- media_types
    ('contentType', 'https://github.com/denoland/deno_std/tree/main/media_types#contenttype', 15),
    ('extension', 'https://github.com/denoland/deno_std/tree/main/media_types#extension', 15),
    ('extensionsByType', 'https://github.com/denoland/deno_std/tree/main/media_types#extensionsbytype', 15),
    ('formatMediaType', 'https://github.com/denoland/deno_std/tree/main/media_types#formatmediatype', 15),
    ('getCharset', 'https://github.com/denoland/deno_std/tree/main/media_types#getcharset', 15),
    ('parseMediaType', 'https://github.com/denoland/deno_std/tree/main/media_types#parsemediatype', 15),
    ('typeByExtension', 'https://github.com/denoland/deno_std/tree/main/media_types#typebyextension', 15),

    -- path
    ('basename', 'https://github.com/denoland/deno_std/tree/main/path#basename', 16),
    ('dirname', 'https://github.com/denoland/deno_std/tree/main/path#dirname', 16),
    ('extname', 'https://github.com/denoland/deno_std/tree/main/path#extname', 16),
    ('format', 'https://github.com/denoland/deno_std/tree/main/path#format', 16),
    ('fromFileUrl', 'https://github.com/denoland/deno_std/tree/main/path#fromfileurl', 16),
    ('isAbsolute', 'https://github.com/denoland/deno_std/tree/main/path#isabsolute', 16),
    ('join', 'https://github.com/denoland/deno_std/tree/main/path#join', 16),
    ('normalize', 'https://github.com/denoland/deno_std/tree/main/path#normalize', 16),
    ('parse', 'https://github.com/denoland/deno_std/tree/main/path#parse', 16),
    ('relative', 'https://github.com/denoland/deno_std/tree/main/path#relative', 16),
    ('resolve', 'https://github.com/denoland/deno_std/tree/main/path#resolve', 16),
    ('toFileUrl', 'https://github.com/denoland/deno_std/tree/main/path#tofileurl', 16),
    ('toNamespacedPath', 'https://github.com/denoland/deno_std/tree/main/path#tonamespacedpath', 16),
    ('common', 'https://github.com/denoland/deno_std/tree/main/path#common', 16),
    ('globToRegExp', 'https://github.com/denoland/deno_std/tree/main/path#globtoregexp', 16),

    -- signal
    ('signal', 'https://github.com/denoland/deno_std/tree/main/signal#signal-1', 17),


    -- streams
    ('Conversion', 'https://github.com/denoland/deno_std/tree/main/streams#conversion', 18),


    -- testing
    ('assert', 'https://github.com/denoland/deno_std/tree/main/testing#usage', 19),
    ('Snapshot Testing', 'https://github.com/denoland/deno_std/tree/main/testing#snapshot-testing', 19),
    ('Behavior-driven development', 'https://github.com/denoland/deno_std/tree/main/testing#behavior-driven-development', 19),
    ('Mocking', 'https://github.com/denoland/deno_std/tree/main/testing#mocking', 19),

    -- uuid
    ('uuid', 'https://github.com/denoland/deno_std/tree/main/uuid#examples', 20),

    -- wasi
    ('WebAssembly', 'https://github.com/denoland/deno_std/tree/main/wasi#usage', 21),

    -- Semver
    ('semver', 'https://github.com/denoland/deno_std/tree/main/semver#usage', 22)

    ON CONFLICT(link) DO NOTHING;
  `);
  }

  /**
   * update the last datetime time we learned a topic. This is saved on localStorage
   */
  update_last_run_datetime() {
    localStorage.setItem("last_run_datetime", Date.now().toString());
  }

  /**
   * the last datetime time we learned a topic. From localStorage
   */
  get_last_run_datetime(): string | null {
    return localStorage.getItem("last_run_datetime");
  }

  /**
   * Get stats of usage, like:
   * - topics learned in comparison with total we have to learn
   * - Libraries with most topics learned
   * - How long since our last learned topic
   */
  get_stats() {
    const left_to_learn_query = this.db.prepareQuery(`
      SELECT 
        count(topics_completed.topic_id) AS topics_completed_count,
        (SELECT count(*) FROM topics) AS total_topics_count
      FROM topics_completed;
    `).firstEntry();

    const most_learned_libs_query = this.db.queryEntries(`
      SELECT
        count(std_libs.id) AS count,
        std_libs.name
      FROM
        topics_completed
        JOIN topics ON topics_completed.topic_id = topics.id
        JOIN std_libs ON topics.lib_id = std_libs.id
      GROUP BY
        std_libs.id
      ORDER BY
        count DESC
      LIMIT 3;
    `);

    return {
      most_learned_libs: most_learned_libs_query as {
        count: number;
        name: string;
      }[],
      topics_completed_count: Number(
        left_to_learn_query?.topics_completed_count,
      ),
      total_topics_count: Number(left_to_learn_query?.total_topics_count),
    };
  }
}
