import Router from "express";
import auth from "./auth.routes"
import employees from "./employee.routes"
import departments from "./department.routes"
import designations from "./designation.routes"
import areas from "./area.routes"
import zones from "./zone.routes"
import idProveTypes from "./idProofType.routes"
import visitors from "./visitor.routes"
import security_questions from "./security_question.routes"
import materials from "./material.routes"
import utility from "../common/utility";
const router = Router();

router.use("/v1/auth", auth);
router.use("/v1/employees", employees);
router.use("/v1/visitor", utility.authenticateUser, visitors);
router.use("/v1/material", utility.authenticateUser, materials);

// data routes
router.use("/v1/area", areas);
router.use("/v1/department", departments);
router.use("/v1/designation", designations);
router.use("/v1/id_proof_type", idProveTypes);
router.use("/v1/security_question", security_questions);
router.use("/v1/zone", zones);

export default router;