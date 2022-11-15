import Router from "express";
import utility from "../common/utility";
import Controller from "../controllers/designation.controllers";
const router = Router();


router.post("/", utility.authenticateAdmin,  Controller.createDesignation);
router.get("/", Controller.getAllDesignation);
router.get("/:designation_id", utility.authenticateAdmin, Controller.designationDetailsByDesignationId);
router.put("/:designation_id", utility.authenticateAdmin, Controller.updateDesignationDetails);
router.delete("/:designation_id", utility.authenticateAdmin, Controller.deleteDesignation);


export default router;
