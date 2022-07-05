// TODO: more robust user home dir detection. won't work on windows most likely.
const USER_HOME_PATH = Deno.env.get("HOME");

export const APP_DATA_PATH = `${USER_HOME_PATH}/.deno_daily`;
export const DB_PATH = `${APP_DATA_PATH}/deno_daily.db`;
