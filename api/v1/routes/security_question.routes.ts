import Router from "express";
import utility from "../common/utility";
import Controller from "../controllers/security_question.controllers";
const router = Router();


router.post("/", utility.authenticateAdmin,  Controller.createSecurityQuestion);
router.get("/", Controller.getAllSecurityQuestion);
router.get("/:security_question_id", utility.authenticateAdmin, Controller.securityQuestionDetailsBySecurityQuestionId);
router.put("/:security_question_id", utility.authenticateAdmin, Controller.updateSecurityQuestionDetails);
router.delete("/:security_question_id", utility.authenticateAdmin, Controller.deleteSecurityQuestion);


export default router;
