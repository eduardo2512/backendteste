import { Request, Response } from "express";
import { Client } from "pg";

export default class GeoSqlController {
  public async index(request: Request, response: Response) {
    const { table } = request.query;

    const client = new Client({
      host: "localhost",
      database: "geosql",
      port: 5433,

      user: "postgres",
      password: "123456"
    });

    try {
      await client.connect();

      const { rows: columns_name } = await client.query(`
        SELECT DISTINCT column_name as column FROM information_schema.columns WHERE table_schema = 'geodata' and table_name = '${table}' and column_name <> 'geom';`);

      let columnsProperties = "";

      columns_name.forEach(column_name => {
        columnsProperties += `'${column_name.column}', ${column_name.column}, `;
      });

      columnsProperties = columnsProperties.slice(0, -2);

      const { rows: consult } = await client.query(`
        SELECT jsonb_build_object(
          'type', 'Feature',
          'properties', jsonb_build_object(
            ${columnsProperties}
          ),
          'geometry', ST_AsGeoJSON(ST_Transform(ST_CurveToLine(geom,0,0,0),4678)::geometry)::jsonb
        ) AS geojson
        FROM geodata.${table};`);

      client.end();

      const objGeoJson = {
        type: "FeatureCollection",
        name: `${table}`,
        features: consult.map(consulta => consulta.geojson)
      };

      return response.json(objGeoJson);
    } catch (error) {
      if (client) {
        client.end();
      }

      return response.status(400).json((error as Error).message);
    }
  }
}
