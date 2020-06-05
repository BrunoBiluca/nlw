import knex from "../database/connection"
import { Request, Response, Router } from "express"

class ItemsController{

    constructor(routes: Router){
        routes.use("/items", this.index)
    }

    async index(request: Request, response: Response){
        const items = await knex('items').select()



        return response.json(items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`
            }
        }))
    }
}
export default ItemsController
