import { conn } from "./lib/init.js";

let selection = await conn.from('cars')
.cons({
    isEqualto: ['id', 3]
})
.delete()
