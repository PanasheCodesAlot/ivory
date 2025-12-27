import { CreatePool, Database } from "./ivory.js";

const user = 'postgres'
const host = 'localhost'
const database = 'postgres'
const password = '1234'

const pool = new CreatePool(user, host, database, password)
export const conn = new Database(pool)