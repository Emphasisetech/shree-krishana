import Router from "express";
import utility from "../common/utility";
import Controller from "../controllers/zone.controllers";
const router = Router();

router.post("/", utility.authenticateAdmin, Controller.createZone);
router.get("/", utility.authenticateUser, Controller.getAllZone);
router.get("/zone_color", utility.authenticateAdmin, Controller.getZonecolors);
router.get("/:zone_id", utility.authenticateAdmin, Controller.zoneDetailsByZoneId);
router.put("/:zone_id", utility.authenticateAdmin, Controller.updateZoneDetails);
router.delete("/:zone_id", utility.authenticateAdmin, Controller.deleteZone);


export default router;
