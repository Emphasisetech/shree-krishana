import Router from "express";
import utility from "../common/utility";
import AuthController from "../controllers/auth.controllers";
const router = Router();

router.post("/signup", AuthController.signup);
router.post("/add_question/:employee_id", AuthController.addQuestions);
router.post("/login", AuthController.logIn);
router.put("/change_password", utility.authenticateUser, AuthController.changePassword);
router.get("/forget_password", AuthController.findEmployeeByUserName);
router.put("/check_question/:employee_id", AuthController.checkQuestion);
router.put("/reset_password", AuthController.resetPassword);
router.put("/reset_password/:employee_id", utility.authenticateAdmin, AuthController.resetPasswordByAdmin);


export default router;
