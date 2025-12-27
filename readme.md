
# 🐘 Ivory

## Simplifies PostgreSQL CRUD operations using JavaScript syntax.

A high-level API that allows you to simulate SQL queries easily and flexibly within Postgres. 🚀

* **Write queries** within JavaScript without writing manual SQL strings ✍️
* **Perform CRUD operations**, including complex multi-conditioned queries 🛠️
* **Create query templates** suitable for heterogeneous transactions 📋
* **Better error handling** via a built-in handler that strips away bulk and presents debug-friendly info 🔍
* **Pure SQL performance** despite the friendly JavaScript interface ⚡

> **Note:** Intended for PostgreSQL only. 🐘

---

## ⚙️ Installation

1. **Postgres Setup**: Ensure you have Postgres installed. If not, check out this [quick tutorial](https://www.w3schools.com/postgresql/index.php). 🎓
2. **Clone this repo**:
```bash
git clone https://github.com/yourusername/ivory.git

```


3. **Install pg**:
```bash
npm install pg

```



---

## 🏁 Next Steps

Let's get you started on creating your first request! 🏃‍♂️

1. Navigate to the `lib/init.js` file.
2. Tweak the values to match your specific database configuration. 🔧

<img src='./images/2.png'>

Now, anytime you want to use the **Ivory API**, simply import the `conn` object:

<img src='./images/3.png'>

---

## 📑 Your First Query

### Syntax

Every query starts with the `.from()` parameter. This tells the API which table you are targeting. 🎯

`let selection = await conn.from('cars')`

> [!IMPORTANT]
> Always use `await` statements! All queries are asynchronous. ⏳

### Conditions (`.cons`)

Conditions are the properties that follow the `WHERE` statement in SQL (e.g., `id = 1`).

```javascript
import { conn } from "./lib/init.js";

let selection = await conn.from('cars')
.cons({
    isEqualTo: ['id', 1, 'AND'],
    isLike: ['name', 'Aston Martin'],
})

```

**Standard Format:**
`condition: [column, value, operator]`
- Operators are only neccesary to define how the statement relates to the next, e.g `SELECT * FROM cars WHERE id = 1 AND name ilike(%Aston Martin%);`

**Available Keywords:**

* `isEqualTo` : `=` ⚖️
* `isGreaterThan`: `>` 📈
* `isLessThan`: `<` 📉
* `isLike`: `ilike` 🔍
* `range(from, to)`: `LIMIT/OFFSET` 📏

### Operation Types

Finally, choose your operation: `select`, `update`, `delete`, or `insert`.

```javascript
import { conn } from "./lib/init.js";

let selection = await conn.from('cars')
.cons({
    isEqualTo: ['id', 1, 'AND'],
    isLike: ['name', 'Aston Martin'],
})
.select(['id', 'name', 'model', 'color'])

```

---

## ⚠️ Important Notes

### 🔄 Updates

Refer to the columns directly as an object inside the `.update()` parentheses:

```javascript
let update = await conn.from('cars')
.cons({ isEqualTo: ['id', 3] })
.update({
    model: 'KG55',
    name: 'AS'
})

```

### 📥 Insertion

Leave the `.cons()` method empty (or pass an empty object) when performing an insert:

```javascript
let insertion = await conn.from('cars')
.cons({}) 
.insert({
    name: 'Mazda',
    year: 2017,
    model: 'CX-5'
})

```

### 🗑️ Deletion

Target specific rows using conditions before calling `.delete()`:

```javascript
let del = await conn.from('cars')
.cons({ isEqualTo: ['id', 3] })
.delete()

```

---

## 🐛 Found a Bug?

Please make sure you **create an issue**. I'll work on it as soon as possible, or feel free to submit a Pull Request! 🤝

---