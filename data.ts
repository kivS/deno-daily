import { DB } from "./deps.ts";

interface Topic{
    id: number;
    name: string;
    link: string;
    is_completed: boolean;
    lib_id: number;
}

interface StdLib{
    name: string;
    description: string;
}

// TODO: fix typescript types

// TODO: db location in home dir
export const db = new DB("./db.sqlite");


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

export async function seed_libs(){
    const sql = await Deno.readTextFile('./seed_libs.sql');
    db.execute(sql)
}

export async function seed_topics(){
    const sql = await Deno.readTextFile('./seed_topics.sql');
    db.execute(sql)
}


export function get_random_topic(): Topic | undefined {
    for(const [id, name, link, is_completed, lib_id] of db.query(`
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
    `)){
        return {id, name, link, is_completed: Boolean(is_completed), lib_id};
    }
  
}


export function get_lib_from_id(lib_id: number): StdLib | undefined {
    for(const [name, description] of db.query(`
        SELECT
            name,
            description
        FROM
            std_libs
        WHERE
            id = ?
    `, [lib_id])){
        return {name, description};
    }
}

export function complete_topic(topic_id: number){
    return db.query(`
        INSERT INTO topics_completed (topic_id, is_completed) VALUES (?, 1)
    `, [topic_id]);
}

export function reset_completed_topics(){
    return db.query(`
        DELETE FROM topics_completed
    `);
}

export function get_configs(){
    for(const [seeding_completed] of db.query(`
        SELECT
            seeding_completed
        FROM
            configs
    `)){
        return {seeding_completed: Boolean(seeding_completed)};
    }
}

export function set_seeding_to_complete(){
    return db.query(`
        UPDATE configs SET seeding_completed = 1
    `);
}