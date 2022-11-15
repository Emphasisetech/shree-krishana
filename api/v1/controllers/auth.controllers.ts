import { Request, Response } from "express";
import responseMessages from "../common/response.messages";
import ResponseMessages from "../common/response.messages";
import utility, { Validation } from "../common/utility";
import { IPayloadUser } from "../interfaces/data.interfaces";
import Services from "../services/auth.services";
import {  ChangePassViewModel, LoginViewModel, SignupViewModel, addQuestionsViewModel } from "../view_model/employee";

class AuthControllersData {
  signup = async (req: Request, res: Response) => {
    try {
      if (!req.files || !req.files.image) {
        return res.status(400).send({ success: false, message: responseMessages.IMG_REQ });
      } else {
        let validated_data: Validation = await utility.validateAndConvert(SignupViewModel, req.body);
        if (validated_data.error && validated_data.error.length > 0) {
          return res.status(400).send({
            success: false,
            message: responseMessages.VALIDATION_ERROR,
            data: validated_data.error[0]
          });
        } else {
          let employee = await Services.signup(req, validated_data.data);
          return res.status(employee.status_code).send(employee.data);
        }
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  logIn = async (req: Request, res: Response) => {
    try {
      let validated_data: Validation = await utility.validateAndConvert(LoginViewModel, req.body);
      if (validated_data.error && validated_data.error.length > 0) {
        return res.status(400).send({
          success: false,
          message: responseMessages.VALIDATION_ERROR,
          data: validated_data.error[0]
        });
      } else {
        let employee = await Services.logIn(req, validated_data.data);
        return res.status(employee.status_code).send(employee.data);
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      let validated_data: Validation = await utility.validateAndConvert(ChangePassViewModel, req.body);
      if (validated_data.error && validated_data.error.length > 0) {
        return res.status(400).send({
          success: false,
          message: responseMessages.VALIDATION_ERROR,
          data: validated_data.error[0]
        });
      } else {
        let employee = await Services.changePassword(req, validated_data.data);
        return res.status(employee.status_code).send(employee.data);
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  resetPasswordByAdmin = async (req: Request, res: Response) => {
    try {
      if (!req.body.password) {
        return res.status(400).send({
          success: false,
          message: responseMessages.PASSWORD_REQ,
        });
      } else {
        let employee = await Services.resetPassword(req.body.password, parseInt(req.params.employee_id));
        return res.status(employee.status_code).send(employee.data);
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  addQuestions = async (req: Request, res: Response) => {
    try {
      let validated_data: Validation = await utility.validateAndConvert(addQuestionsViewModel, req.body);
      if (validated_data.error && validated_data.error.length > 0) {
        return res.status(400).send({
          success: false,
          message: responseMessages.VALIDATION_ERROR,
          data: validated_data.error[0]
        });
      } else {
        let employee = await Services.addQuestions(req, validated_data.data.questions);
        return res.status(employee.status_code).send(employee.data);
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  findEmployeeByUserName = async (req: Request, res: Response) => {
    try {
      if (!req.body.username) {
        return res.status(400).send({
          success: false,
          message: responseMessages.USERNAME_REQ
        });
      } else {
        let employee = await Services.findEmployeeByUserName(req.body.username);
        return res.status(employee.status_code).send(employee.data);
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  checkQuestion = async (req: Request, res: Response) => {
    try {
      let validated_data: Validation = await utility.validateAndConvert(addQuestionsViewModel, req.body);
      if (validated_data.error && validated_data.error.length > 0) {
        return res.status(400).send({
          success: false,
          message: responseMessages.VALIDATION_ERROR,
          data: validated_data.error[0]
        });
      } else {
        let employee = await Services.checkQuestion(req, validated_data.data.questions);
        return res.status(employee.status_code).send(employee.data);
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      if (!req.body.password) {
        return res.status(400).send({
          success: false,
          message: responseMessages.PASSWORD_REQ,
        });
      } else {
        let User = req.user as IPayloadUser
        let employee = await Services.resetPassword(req.body.password, User.id);
        return res.status(employee.status_code).send(employee.data);
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
}
export default new AuthControllersData();
