import knex from "../database/connection"
import { Request, Response, Router } from "express"

class ItemsController{

    constructor(routes: Router){
        routes.use("/items", this.index)
    }

    async index(request: Request, response: Response){
        const items = await knex('items').select()
        return response.json(items)
    }
}
export default ItemsController
