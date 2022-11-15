import Router from "express";
import utility from "../common/utility";
import idProofTypeControllers from "../controllers/idProofType.controllers";
const router = Router();


router.post("/", utility.authenticateAdmin, idProofTypeControllers.createIdProveType);
router.get("/", utility.authenticateUser, idProofTypeControllers.getAllIdProveType);
router.get("/:id_proof_type_id", utility.authenticateAdmin, idProofTypeControllers.idProveTypeDetailsByIdProveTypeId);
router.put("/:id_proof_type_id", utility.authenticateAdmin, idProofTypeControllers.updateIdProveTypeDetails);
router.delete("/:id_proof_type_id", utility.authenticateAdmin, idProofTypeControllers.deleteIdProveType);


export default router;
