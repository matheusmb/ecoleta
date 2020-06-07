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

    const serializedPoints = points.map((points) => ({
      ...points,
      image_url: `http://192.168.1.111:3333/uploads/${point.image}`,
    }));

    return response.json(serializedPoints);
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

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.1.111:3333/uploads/${point.image}`,
    };

    return response.json({ serializedPoint, items });
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
      image: request.file.filename,
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

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => ({
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
