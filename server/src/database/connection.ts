import Knex from 'knex'
import path from 'path'

var connection = Knex({
    client: "sqlite3",
    connection: {
        filename: path.resolve(__dirname, "database", "database.sqlite")
    },
    migrations: {
        tableName: 'migrations'
    },
    useNullAsDefault: true
})

export default connection