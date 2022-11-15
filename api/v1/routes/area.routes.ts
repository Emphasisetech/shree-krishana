import Router from "express";
import utility from "../common/utility";
import Controller from "../controllers/area.controllers";
const router = Router();

router.post("/", utility.authenticateAdmin, Controller.createArea);

router.get("/", utility.authenticateUser, Controller.getAllArea);
router.get("/by_zone/:zone_id",  Controller.areasByZone);
router.get("/:area_id", utility.authenticateAdmin, Controller.areaDetailsByAreaId);

router.put("/:area_id", utility.authenticateAdmin, Controller.updateAreaDetails);
router.delete("/:area_id", utility.authenticateAdmin, Controller.deleteArea);


export default router;
