import Router from "express";
import utility from "../common/utility";
import Controller from "../controllers/department.controllers";
const router = Router();


router.post("/", utility.authenticateAdmin,  Controller.createDepartment);
router.get("/", Controller.getAllDepartment);
router.get("/:department_id", utility.authenticateAdmin, Controller.departmentDetailsByDepartmentId);
router.put("/:department_id", utility.authenticateAdmin, Controller.updateDepartmentDetails);
router.delete("/:department_id", utility.authenticateAdmin, Controller.deleteDepartment);


export default router;
