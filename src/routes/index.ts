import { Router } from "express";
import GeoSqlController from "../controllers/GeoSqlController";

const routes = Router();
const geoSqlController = new GeoSqlController();

routes.get("/databases", geoSqlController.index);

export default routes;
