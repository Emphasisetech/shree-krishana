import { Request } from "express";
import { SecurityQuestion } from "../models/security_question";
import ResponseMessages from "../common/response.messages";
import { ICommonServices } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
class UserServicesData {
  createSecurityQuestion = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        const checkSecurityQuestion = await connection.manager.find(SecurityQuestion, { statement: req.body.statement });
        if (checkSecurityQuestion.length) {
          message = ResponseMessages.SEC_QUE_EXIST;
          return
        }
        let newSecurityQuestion = new SecurityQuestion();
        newSecurityQuestion.statement = req.body.statement;
        newSecurityQuestion.is_deleted = false;
        res_data = await connection.manager.save(newSecurityQuestion);
        message = ResponseMessages.SEC_QUE_CREATED
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.SEC_QUE_CREATED } };
      } else {
        message = message ? message : ResponseMessages.SEC_QUE_CREATED_NOT;
        return { status_code: 200, data: { success: false, data: res_data, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllSecurityQuestion = async () => {
    try {
      let res_data
      await connection.then(async connection => {
        const security_questions: SecurityQuestion[] = await connection.manager.find(SecurityQuestion);
        res_data = security_questions
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.SEC_QUE_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.SEC_QUE_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  securityQuestionDetailsBySecurityQuestionId = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const security_question: any = await connection.manager.findOne(SecurityQuestion, req.params.security_question_id);
        res_data = security_question
        console.log(res_data);
        return
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.SEC_QUE_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.SEC_QUE_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  updateSecurityQuestionDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        // const checkSecurityQuestion = await connection.manager.find(SecurityQuestion, { statement: req.body.statement });
        const repo: any = await connection.getRepository(SecurityQuestion);
        let checkSecurityQuestion = await repo.createQueryBuilder("sq")
          .andWhere("sq.statement=:statement", { statement: req.body.statement })
          .andWhere("sq.id!=:id", { id: req.params.area_id })
          .execute();
        if (checkSecurityQuestion.length) {
          message = ResponseMessages.SEC_QUE_EXIST;
          return
        }
        let foundSecurityQuestion: any = await connection.manager.findOne(SecurityQuestion, req.params.security_question_id);
        foundSecurityQuestion.statement = req.body.statement ? req.body.statement : foundSecurityQuestion.statement;
        res_data = await connection.manager.save(foundSecurityQuestion);
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.SEC_QUE_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.SEC_QUE_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  deleteSecurityQuestion = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        let security_question: any = await connection.manager.findOne(SecurityQuestion, req.params.security_question_id);
        security_question.is_deleted = true
        await connection.manager.save(security_question);
        res_data = security_question;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.SEC_QUE_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.SEC_QUE_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

}
export default new UserServicesData();
