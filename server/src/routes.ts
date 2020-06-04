import express, { Request, Response } from 'express'
import knex from './database/connection'
import PointsController from './controllers/points_controller'
import ItemsController from './controllers/items_controller'

const routes = express.Router()

new PointsController(routes)
new ItemsController(routes)

export default routes

routes.get('/', (request: express.Request, response: express.Response) => {
    response.send("Hello World")
})

let users = [
    { "name": "Bruno" },
    { "name": "José" },
    { "name": "Lucy" },
    { "name": "Daniel" }
]

routes.get('/users', (request: Request, response: Response) => {
    response.json(users)
})

routes.get('/users/:id', (request: Request, response: Response) => {
    let userId = Number(request.params.id)
    response.json(users[userId])
})

routes.post('/users', (request: Request, response: Response) => {
    let user = request.body
    response.json(user)
})
