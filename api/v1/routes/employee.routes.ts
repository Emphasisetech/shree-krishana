import Router from "express";
import utility from "../common/utility";
import UserController from "../controllers/employee.controllers";
const router = Router();

router.get("/", utility.authenticateUser, UserController.findAll);
router.get("/:employee_id", utility.authenticateUser, UserController.getEmployeeDetailsByEmployeeId);

router.put("/", utility.authenticateUser, UserController.updateEmployeeDetails);
router.put("/assign_role/:employee_id", utility.authenticateAdmin, UserController.assignRole);
router.put("/accept/:employee_id", utility.authenticateAdmin, UserController.acceptEmployee);

router.delete("/:employee_id", utility.authenticateAdmin, UserController.deleteEmployee);


export default router;
