import { Request, Response } from "express";
import { Client } from "pg";

export default class GeoSqlController {
  public async index(request: Request, response: Response) {
    const client = new Client({
      host: "localhost",
      database: "geosql",
      port: 5433,

      user: "postgres",
      password: "123456"
    });

    try {
      await client.connect();

      // Retorna apenas as tabelas (para facilitar a indexação).
      const { rows: tables } = await client.query(
        `SELECT DISTINCT table_name as name FROM information_schema.columns WHERE table_schema = 'geodata' ORDER BY table_name;`
      );

      client.end();

      return response.json(tables);
    } catch (error) {
      if (client) {
        client.end();
      }

      return response.status(400).json((error as Error).message);
    }
  }
}
