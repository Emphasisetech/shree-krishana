import _ from "lodash";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import stringSimilarity from "string-similarity";
import utility from "../common/utility";
import role from "../common/constants/role";
import Path from "../common/constants/path";
import { Employee } from "../models/employee";
import ResponseMessages from "../common/response.messages";
import { ICommonServices, IEmployeeDetails, IPayloadUser } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
import { questionsViewModel, ChangePassViewModel, LoginViewModel, SignupViewModel } from "../view_model/employee";
import { QuestionAnswer } from "../models/question_answer";

class AuthServicesData {
  signup = async (req: Request, req_body_data: SignupViewModel): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        const check_employee = await connection.manager.find(Employee, {
          where: [
            { id_card_number: req_body_data.id_card_number },
            { username: req_body_data.username },
          ],
        });
        if (check_employee.length) {
          message = ResponseMessages.EMPLOYEE_EXIST;
          return;
        }
        let file: UploadedFile = <UploadedFile>req.files?.image;
        let ext = _.split(file.name, ".")[1];
        let unique_id = v4();
        let new_image_name = `${unique_id}.${ext}`;
        let image = await utility.saveFile(file, Path.employee, new_image_name) ? new_image_name : '';
        let newEmployee = new Employee();
        newEmployee.name = req_body_data.name;
        newEmployee.unique_id = unique_id;
        newEmployee.role = role.USER;
        newEmployee.designation = req_body_data.designation;
        newEmployee.department = req_body_data.department;
        newEmployee.username = req_body_data.username;
        newEmployee.address = req_body_data.address;
        newEmployee.id_card_number = req_body_data.id_card_number;
        newEmployee.image = image;
        newEmployee.phone_number = req_body_data.phone_number;
        newEmployee.is_accepted = false;
        newEmployee.is_deleted = false;
        const salt = await bcrypt.genSalt(10);
        newEmployee.password = await bcrypt.hash(req_body_data.password, salt);
        res_data = await connection.manager.save(newEmployee);
        res_data.image = `${process.env.BASE_URL}${Path.employee}/${new_image_name}`;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.EMPLOYEE_SIGNUP } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.EMPLOYEE_SIGNUP_NOT;
        return { status_code, data: { success: false, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  logIn = async (req: Request, req_body_data: LoginViewModel): Promise<ICommonServices> => {
    try {
      let data: any;
      let token;
      let message: string = '';
      await connection.then(async connection => {
        const check_employee = await connection.manager.findOne(Employee, { username: req_body_data.username });
        if (!check_employee) {
          message = ResponseMessages.EMPLOYEE_EXIST_NOT;
          return;
        } else if (check_employee.is_deleted) {
          message = ResponseMessages.EMPLOYEE_BLOCKED_BY_ADMIN;
          return;
        } else if (!check_employee.is_accepted) {
          message = ResponseMessages.EMPLOYEE_ACTIVE_NOT;
          return;
        } else if (await bcrypt.compare(req_body_data.password, check_employee.password)) {
          token = utility.signJWT(
            {
              username: check_employee.username,
              role: check_employee.role,
              id: check_employee.id,
              unique_id: check_employee.unique_id,
            },
            "30d"
          )
          data = check_employee;
          return;
        } else {
          message = ResponseMessages.EMPLOYEE_WRONG_PASSWORD;
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (data) {
        let res_data: IEmployeeDetails = {
          id: data.id,
          name: data.name,
          role: data.role,
          username: data.username,
          designation: data.designation,
          department: data.department,
          address: data.address,
          is_temporary_password: data.is_temporary_password,
          id_card_number: data.id_card_number,
          image: data.image ? `${process.env.BASE_URL}${Path.employee}/${data.image}` : '',
          phone_number: data.phone_number
        }
        return { status_code: 200, data: { success: true, data: { user: res_data, token }, message: ResponseMessages.EMPLOYEE_LOGIN } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.EMPLOYEE_LOGIN_NOT;
        return { status_code, data: { success: false, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  addQuestions = async (req: Request, req_body_data: questionsViewModel[]): Promise<ICommonServices> => {
    try {
      let data: any;
      let message: string = '';
      await connection.then(async connection => {
        const check_employee = await connection.manager.findOne(Employee, req.params.employee_id);
        if (!check_employee) {
          message = ResponseMessages.EMPLOYEE_EXIST_NOT;
          return;
        } else {
          let new_data: QuestionAnswer[] = []
          req_body_data.forEach((e) => {
            let new_question = new QuestionAnswer();
            new_question.employee = parseInt(req.params.employee_id);
            new_question.question = e.question;
            new_question.answer = e.answer;
            new_data.push(new_question)
          })

          data = await connection.manager.save(new_data)
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (data) {
        return { status_code: 200, data: { success: true, data, message: ResponseMessages.AUTH_QUESTION_ADDED } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.AUTH_QUESTION_ADDED_NOT;
        return { status_code, data: { success: false, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  changePassword = async (req: Request, req_body_data: ChangePassViewModel): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser
      let data: any;
      let message: string = '';
      await connection.then(async connection => {
        const check_employee = await connection.manager.findOne(Employee, User.id);
        if (!check_employee) {
          message = ResponseMessages.EMPLOYEE_EXIST_NOT;
          return;
        } else if (await bcrypt.compare(req_body_data.old_password, check_employee.password)) {

          const salt = await bcrypt.genSalt(10);
          check_employee.password = await bcrypt.hash(req_body_data.new_password, salt);
          data = await connection.manager.save(check_employee)
          return;
        } else {
          message = ResponseMessages.EMPLOYEE_OLD_PASSWORD_SAME_NOT;
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.EMPLOYEE_PASSWORD_CHANGED } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.EMPLOYEE_PASSWORD_CHANGED_NOT;
        return { status_code, data: { success: false, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  findEmployeeByUserName = async (username: string): Promise<ICommonServices> => {
    try {
      let data: any;
      let message: string = '';
      await connection.then(async connection => {
        const found_employee = await connection.manager.findOne(Employee, { username, is_deleted: false });
        if (!found_employee) {
          message = ResponseMessages.AUTH_USERNAME_NOT;
          return;
        } else {
          const QARepo: any = await connection.getRepository(QuestionAnswer);
          let questions = await QARepo.createQueryBuilder("qa")
            .leftJoinAndSelect("qa.question", "q")
            .select(["q.id as question_id", "q.statement as question"])
            .execute();
          data = { employee_id: found_employee.id, questions }
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (data) {
        return { status_code: 200, data: { success: true, data, message: ResponseMessages.EMPLOYEE_DETAILS_FOUND } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.EMPLOYEE_DETAILS_FOUND_NOT;
        return { status_code, data: { success: false, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  checkQuestion = async (req: Request, req_body_data: questionsViewModel[]): Promise<ICommonServices> => {
    try {
      let message: string = '';
      let wrong_questions: any[] = [];
      let is_correct: boolean = true;
      await connection.then(async connection => {
        const areaRepo: any = await connection.getRepository(QuestionAnswer);
        let found_question = await areaRepo.createQueryBuilder("a")
          .andWhere("a.employee=:employee_id", { employee_id: req.params.employee_id })
          .select(["a.answer as answer", "a.question as question"])
          .execute();
        if (!found_question) {
          message = ResponseMessages.EMPLOYEE_EXIST_NOT;
          return;
        } else {
          found_question.forEach((e: any, i: number) => {
            req_body_data.forEach((data: any, i: number) => {
              if (e.question == data.question) {
                if (stringSimilarity.compareTwoStrings(data.answer.toLocaleLowerCase(), e.answer.toLocaleLowerCase()) < .95) {
                  is_correct = false;
                  wrong_questions.push(e.question);
                }
              }
            });
          });
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (is_correct) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.AUTH_ANS_CORRECT } };
      } else {
        message = message ? message : ResponseMessages.AUTH_ANS_CORRECT_NOT;
        return { status_code: 200, data: { data: { wrong_questions }, success: false, message } };
      }
    } catch (error) {
      console.log(error);

      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  resetPassword = async (password: string, employeeId: number): Promise<ICommonServices> => {
    try {
      let data: any;
      let message: string = '';
      await connection.then(async connection => {
        const check_employee = await connection.manager.findOne(Employee, employeeId);
        if (!check_employee) {
          message = ResponseMessages.EMPLOYEE_EXIST_NOT;
          return;
        } else {
          const salt = await bcrypt.genSalt(10);
          check_employee.password = await bcrypt.hash(password, salt);
          check_employee.is_temporary_password = true;
          data = await connection.manager.save(check_employee)
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.EMPLOYEE_PASSWORD_CHANGED } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.EMPLOYEE_PASSWORD_CHANGED_NOT;
        return { status_code, data: { success: false, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

}
export default new AuthServicesData();
