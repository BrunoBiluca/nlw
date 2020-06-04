import Knex from 'knex'
import path from 'path'

var knex = Knex({
    client: "sqlite3",
    connection: {
        filename: path.resolve(__dirname, "database.sqlite")
    },
    migrations: {
        tableName: 'migrations'
    },
    useNullAsDefault: true
})

export default knex