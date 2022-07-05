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

export const db = new DB(DB_PATH);

export function init_db() {
  db.execute(`
        CREATE TABLE IF NOT EXISTS std_libs (
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT
        );
  
       CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY,
            name TEXT,
            link TEXT,
            lib_id INTEGER REFERENCES std_libs(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

     
        CREATE TABLE IF NOT EXISTS topics_completed(
                topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE ON UPDATE CASCADE,
                is_completed INT DEFAULT 0
        );     

        CREATE TABLE configs(
            seeding_completed INT DEFAULT 0
        );
        INSERT INTO configs(seeding_completed) VALUES(0);

    `);
}

export function get_random_topic(): Topic | null {
  const query = db.query(`
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

export function get_lib(lib_id: number): Library | null {
  const query = db.query(
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

export function complete_topic(topic_id: number) {
  return db.query(
    `
        INSERT INTO topics_completed (topic_id, is_completed) VALUES (?, 1)
    `,
    [topic_id],
  );
}

export function reset_completed_topics() {
  return db.query(`
        DELETE FROM topics_completed
    `);
}

export function get_configs_from_db() {
  for (
    const [seeding_completed] of db.query(`
        SELECT
            seeding_completed
        FROM
            configs
    `)
  ) {
    return { seeding_completed: Boolean(seeding_completed) };
  }
}

export function set_seeding_to_complete() {
  return db.query(`
        UPDATE configs SET seeding_completed = 1
    `);
}

export function seed_libs() {
  db.execute(`
    INSERT OR REPLACE INTO "std_libs" ("id", "name", "description") VALUES
    ('1', 'archive', 'Provides helpers for archiving and unarchiving files and directories.'),
    ('2', 'async', 'async is a module to provide help with asynchronous tasks.'),
    ('3', 'bytes', 'Provides helper functions to manipulate Uint8Array byte slices that are not included on the Uint8Array prototype.'),
    ('4', 'collections', 'This module includes pure functions for specific common tasks around collection types like Array and Record.');
  `);
}

export function seed_topics() {
  db.execute(`
    INSERT OR REPLACE INTO "topics" ("id", "name", "link", "lib_id") VALUES
    ('1', 'Tar', 'https://github.com/denoland/deno_std/tree/main/archive#tar', '1'),
    ('2', 'Untar', 'https://github.com/denoland/deno_std/tree/main/archive#untar', '1'),
    ('3', 'abortable', 'https://github.com/denoland/deno_std/tree/main/async#abortable', '2'),
    ('4', 'abortablePromise', 'https://github.com/denoland/deno_std/tree/main/async#abortablepromise', '2');
  `);
}
