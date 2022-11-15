import Router from "express";
import Controller from "../controllers/material.controllers";
const router = Router();

router.post("/", Controller.createMaterial); 

router.get("/", Controller.getAllMaterial);
router.get("/report", Controller.getMaterialReport);
router.get("/:material_id", Controller.materialDetailsByMaterialId);

router.put("/recommend/:material_id", Controller.recommendMaterial);
router.put("/approve/:material_id", Controller.approveMaterial);
router.put("/:material_id", Controller.updateMaterialDetails);

router.delete("/:material_id", Controller.deleteMaterial);


export default router;
