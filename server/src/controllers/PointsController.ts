import { Request, Response, json } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const queryParam = request.query;

    const pointsQuery = knex('points').join(
      'point_items',
      'points.id',
      '=',
      'point_items.point_id'
    );

    queryParam &&
      Object.entries(queryParam).map(([key, val]) => {
        if (key == 'items') {
          const parsedItems = String(val)
            .split(',')
            .map((item) => Number(item.trim()));
          parsedItems.length > 0 &&
            pointsQuery.whereIn('point_items.item_id', parsedItems);
        } else {
          pointsQuery.where(key, String(val));
        }
      });

    const points = await pointsQuery.distinct().select('points.*');

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image:
        'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => ({
      item_id,
      point_id,
    }));

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
