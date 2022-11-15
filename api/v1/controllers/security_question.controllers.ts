import { Request, Response } from "express";
import ResponseMessages from "../common/response.messages";
import Services from "../services/security_question.services";

class SecurityQuestionControllersData {
  createSecurityQuestion = async (req: Request, res: Response) => {
    try {
      let employee = await Services.createSecurityQuestion(req);
      return res.status(employee.status_code).send(employee.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getAllSecurityQuestion = async (req: Request, res: Response) => {
    try {
      let security_question: any = await Services.getAllSecurityQuestion();
      if (security_question)
        return res.status(security_question.status_code).send(security_question.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  securityQuestionDetailsBySecurityQuestionId = async (req: Request, res: Response) => {
    try {
      let security_question: any = await Services.securityQuestionDetailsBySecurityQuestionId(req);
      if (security_question)
        return res.status(security_question.status_code).send(security_question.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  updateSecurityQuestionDetails = async (req: Request, res: Response) => {
    try {

      let security_question = await Services.updateSecurityQuestionDetails(req);
      return res.status(security_question.status_code).send(security_question.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  deleteSecurityQuestion = async (req: Request, res: Response) => {
    try {

      let security_question = await Services.deleteSecurityQuestion(req);
      return res.status(security_question.status_code).send(security_question.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
}
export default new SecurityQuestionControllersData();
