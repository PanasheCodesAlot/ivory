import { Pool } from "pg";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234'
})

export class CreatePool {
    pool

    constructor (user, host, database, password) {
        this.pool = new Pool({
            user, host,
            database, password
        })
    }
}

export class Database {
    pool

    async exe (query) {
        let res = pool.query(query)
        return res
    } 

    async insert (query) {
        try { await this.exe(query) }
        catch (e) { throw e }

        return console.log('INSERTED')
    } 

    async select (query) {
        let res = []
        try { res = await this.exe(query) }
        catch (e) { throw e}

        return res.rows
    }

    async update (query) {
        try { await this.exe(query) }
        catch (e) { throw e }

        return console.log('Updated')
    }

    async delete (query) {
        try { await this.exe(query) }
        catch (e) { throw e }

        return console.log('Deleted')
    }

    from = (tablename) => {
        return {
            cons: (cons) => {
                return {
                    select: async (cols) => {
                        const query = createQuery(tablename, cons, cols, 'select')
                        console.log(query)
                        try { return await this.select(query) }
                        catch (e) { return debug(e, query) }
                    },

                    update: async (changes) => {
                        const query = createQuery(tablename, cons, changes, 'update')
                        try { return await this.update(query) }
                        catch (e) { return debug(e, query) }
                    },

                    delete: async () => {
                        const query = createQuery(tablename, cons, null, 'delete')
                        try { return await this.delete(query) }
                        catch (e) { return debug(e, query) }

                    },

                    insert: async (newRow) => {
                        let query = `INSERT INTO ${tablename} (`
                        query += `${Array.from(Object.keys(newRow)).join(', ')}) `
                        query += `VALUES ('${Array.from(Object.values(newRow)).join("', '")}')`

                        try { return await this.insert(query) }
                        catch (e) { return debug(e, query) }

                    }
                }
                
            }
        }
    }

    constructor (pool) {
        this.pool = pool.pool
    }

}

function createSqlCons (cons) {
    let evalCons = []
    const keys = Object.keys(cons)
    const values = Object.values(cons)

    for (let k = 0; k < keys.length; k++) {
        const key = keys[k]
        const value = values[k]
        const operand = (typeof value == 'string')? null : value[2]
        
        switch (key) {
            case 'isEqualTo':
                evalCons.push(`${value[0]} = '${value[1]}'`)
                break

            case 'isGreaterThan':
                evalCons.push(`${value[0]} > '${value[1]}'`)
                break

            case 'isLessThan':
                evalCons.push(`${value[0]} < '${value[1]}'`)
                break

            case 'isLike':
                evalCons.push(`${value[0]} ilike('%${value[1]}%')`)
                break

            case 'range':
                evalCons.push('ORDER BY id')
                evalCons.push(`LIMIT ${value[1] - value[0] + 2} OFFSET ${value[0]}`)
                break

            default:
                evalCons.push(`${key} = '${value}'`)
                if (k + 1 < keys.length) evalCons.push(',')
                break

        }

        if (operand) { evalCons.push(operand)}
        
    }

    return evalCons.join(' ')

}

function createQuery (tablename, cons, cols= [], operation) {
    let query = ''
    switch (operation){
        case 'select':
            query += `SELECT `

            //Cols
            query += ((cols == '*')? cols : cols.join(', ')) 

            //Tablename
            query += ` FROM ${tablename} `

            //Cons
            if (cons) {
                query += 'WHERE ' + createSqlCons(cons)
            }

            return query

        case 'update':
            query += `UPDATE ${tablename} SET `
            query += createSqlCons(cols)
            query += ` WHERE ${createSqlCons(cons)}`
            return query

        case 'delete':
            query += `DELETE FROM ${tablename} `
            query += `WHERE ${createSqlCons(cons)}`
            return query

    }
}

function debug (e, query) {
    //return Object.keys(e)
    throw {
        query: query,
        code: e.code,
        message: e.message,
        position: e.position,
        hint: e.hint,

        
    }
}

export function dbConn () {
    return {
        from: (tablename) => {
            return {
                cons: (cons) => {
                    return {
                        select: async (cols) => {
                            const query = createQuery(tablename, cons, cols, 'select')
                            console.log(query)
                            try { return await db.select(query) }
                            catch (e) { return debug(e, query) }
                        },

                        update: async (changes) => {
                            const query = createQuery(tablename, cons, changes, 'update')
                            try { return await db.update(query) }
                            catch (e) { return debug(e, query) }
                        },

                        delete: async () => {
                            const query = createQuery(tablename, cons, null, 'delete')
                            try { return await db.delete(query) }
                            catch (e) { return debug(e, query) }

                        },

                        insert: async (newRow) => {
                            let query = `INSERT INTO ${tablename} (`
                            query += `${Array.from(Object.keys(newRow)).join(', ')}) `
                            query += `VALUES ('${Array.from(Object.values(newRow)).join("', '")}')`

                            try { return await db.insert(query) }
                            catch (e) { return debug(e, query) }

                        }
                    }
                }
            }
        }
    }
}

// let table = 'health_professional'
// let selection = await dbConn().from(table)
// --- SELECT --- //
// .cons({
    // isEqualTo: ['name', 'Panashe', 'OR'],
    // isGreaterThan: ['id', '11'],
    // range: [1, 10]
    //id: ['>', 50]
// })
// .select(['name', 'id'])

// --- UPDATE --- //
// .cons({
//     isEqualTo: ['id', 9]
// })
// .update({
//     name: 'Panashe',
//     type: 'Main Doctor'
// })

// --- DELETE --- //
// .cons({
//     isEqualTo: ['id', 8]
// })
// .delete()

// --- INSERT --- //
// .cons()
// .insert({
//     name: 'Panashe',
//     type: 'New Doctor'
// })


// console.log(selection)