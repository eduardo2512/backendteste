import { Router } from "express";
import TablesController from "../controllers/TablesController";
import GeoSqlController from "../controllers/GeoJsonController";

const routes = Router();
const tablesController = new TablesController();
const geoSqlController = new GeoSqlController();

routes.get("/tables", tablesController.index);

routes.get("/geojson", geoSqlController.index);

export default routes;
