import knex from "../database/connection";
import { Response, Request, Router } from "express";

class PointsController {

    constructor(routes: Router) {
        routes.get("/points", this.index)
        routes.get("/points/:id", this.show)
        routes.post("/points", this.create)
    }

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query

        const selectedItems = String(items)
            .split(',')
            .map(item => item.trim())

        const points = await knex('points')
            .where('city', String(city))
            .where('uf', String(uf))
            .join('points_items', 'points.id', 'points_items.point_id')
            .whereIn('points_items.item_id', selectedItems)
            .distinct()
            .select('points.*')

        return response.json(points)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params
        const point = await knex('points').where('id', id).first()

        const items = await knex('items')
            .select('title')
            .join("points_items", "items.id", 'points_items.item_id')
            .where('points_items.point_id', id)

        return response.json({
            ...point, items
        })
    }

    async create(request: Request, response: Response) {
        // TODO: adicionar upload de imagens
        const {
            image = 'placeholder.svg',
            name,
            email,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction()

        const insertedIds = await trx('points')
            .insert({
                image,
                name,
                email,
                latitude,
                longitude,
                city,
                uf
            })

        await trx('points_items').insert(items.map((item_id: number) => {
            return {
                point_id: insertedIds[0],
                item_id: item_id
            }
        }))
            .catch(err => {
                console.log(err)
                trx.rollback()
                return response.json({ success: false })
            })

        await trx.commit()

        return response.json({ success: true })
    }
}
export default PointsController
