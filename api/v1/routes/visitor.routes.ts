import Router from "express";
import Controller from "../controllers/visitor.controllers";
const router = Router();

router.post("/", Controller.createVisitor);

router.get("/", Controller.getAllVisitor);
router.get("/report", Controller.getVisitorReport);
router.get("/:visitor_id", Controller.visitorDetailsByVisitorId);

router.put("/recommend/:visitor_id", Controller.recommendVisitor);
router.put("/approve/:visitor_id", Controller.approveVisitor);
// router.put("/:visitor_id", Controller.updateVisitorDetails);

router.delete("/:visitor_id", Controller.deleteVisitor);


export default router;
