import { Request } from "express";
import { Employee } from "../models/employee";
import ResponseMessages from "../common/response.messages";
import { ICommonServices, IMataData, IPayloadUser } from "../interfaces/data.interfaces";
import Path from "../common/constants/path";
import { connection } from "../../../connection/connection";
import { EmployeeBackup } from "../models/employee_backup";
import role from "../common/constants/role";
import common from "../common/constants/common";

class EmployeeServicesData {

  getAllEmployees = async (req: Request) => {
    try {
      let query: IMataData = req.query;
      let page_number = query.page_number ? parseInt(query.page_number) : common.PAGE_NUM;
      let page_size = query.page_size ? parseInt(query.page_size) : common.PAGE_SIZE;
      let skip = page_size * (page_number - 1);

      let res_data: any[] = [];
      await connection.then(async connection => {
        try {
          const employeeRepo: any = await connection.getRepository(Employee);
          res_data = await employeeRepo.createQueryBuilder("e")
            .leftJoinAndSelect("e.designation", "d")
            .leftJoinAndSelect("e.department", "dp")
            .andWhere("e.role != :role", { role: role.ADMIN })
            .andWhere("e.is_deleted != :is_deleted", { is_deleted: 1 })
            .orderBy('id', 'DESC')
            .offset(skip)
            .limit(page_size + 1)
            .select(["e.id as id", "e.name as name", "e.id_card_number as id_card_number", "e.image as image", "e.role as role", "e.unique_id as unique_id", "e.username as username", "e.address as address", "e.phone_number as phone_number", "e.is_accepted as is_accepted", "e.is_deleted as is_deleted", "d.name as designation", "dp.name as department"
            ])
            .execute();
          return;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        let is_next = false;
        if (res_data.length > page_size) {
          is_next = true;
          res_data.pop();
        }
        let metaData = { page_size: page_size, page_number: page_number, is_next };

        res_data.map((e: any) => {
          e.image = e.image ? `${process.env.BASE_URL}${Path.employee}/${e.image}` : '';
          return e
        })
        return { status_code: 200, data: { success: true, metaData, data: res_data, message: ResponseMessages.EMPLOYEE_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.EMPLOYEE_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getEmployeeDetailsByEmployeeId = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data: any[] = []
      await connection.then(async connection => {
        try {
          const employeeRepo: any = await connection.getRepository(Employee);
          res_data = await employeeRepo.createQueryBuilder("e")
            .leftJoinAndSelect("e.designation", "d")
            .leftJoinAndSelect("e.department", "dp")
            .andWhere("e.id = :id", { id: req.params.employee_id })
            .select(["e.id as id", "e.name as name", "e.id_card_number as id_card_number", "e.image as image", "e.role as role", "e.unique_id as unique_id", "e.username as username", "e.address as address", "e.phone_number as phone_number", "e.is_accepted as is_accepted", "e.is_deleted as is_deleted", "d.name as designation", "dp.name as department"
            ])
            .execute();
          return;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data.length) {
        res_data[0].image = res_data[0].image ? `${process.env.BASE_URL}${Path.employee}/${res_data[0].image}` : '';

        return { status_code: 200, data: { success: true, data: res_data[0], message: ResponseMessages.EMPLOYEE_DETAILS_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.EMPLOYEE_DETAILS_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  updateEmployeeDetails1 = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser;
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        if (req.body.id_card_number) {
          const check_employee = await connection.manager.find(Employee, { id_card_number: req.body.id_card_number });
          if (check_employee.length) {
            message = ResponseMessages.EMPLOYEE_EXIST;
            return;
          }
        }
        let employee: any = await connection.manager.findOne(Employee, User.id);
        employee.name = req.body.name ? req.body.name : employee.name;
        employee.id_card_number = req.body.id_card_number ? req.body.id_card_number : employee.id_card_number;
        employee.designation = req.body.designation ? req.body.designation : employee.designation;
        employee.department = req.body.department ? req.body.department : employee.department;
        employee.username = req.body.username ? req.body.username : employee.username;
        employee.address = req.body.address ? req.body.address : employee.address;
        employee.image = req.body.image ? req.body.image : employee.image;
        employee.phone_number = req.body.phone_number ? req.body.phone_number : employee.phone_number;
        await connection.manager.save(employee);
        res_data = employee;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.EMPLOYEE_PROFILE_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.EMPLOYEE_PROFILE_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }
  updateEmployeeDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser;
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        if (req.body.id_card_number) {
          // const check_employee = await connection.manager.find(Employee, { id_card_number: req.body.id_card_number });
          const repo: any = await connection.getRepository(Employee);
          let check_employee = await repo.createQueryBuilder("emp")
            .andWhere("emp.id_card_number=:id_card_number", { id_card_number: req.body.id_card_number })
            .andWhere("emp.id!=:id", { id: User.id })
            .execute();
          if (check_employee.length) {
            message = ResponseMessages.EMPLOYEE_EXIST;
            return;
          }
        }
        let employee: any = await connection.manager.query(`SELECT * from employee WHERE id=${User.id}`);
        ///
        let newEmployee = new EmployeeBackup();
        newEmployee.employee = employee.id;
        newEmployee.name = employee.name;
        newEmployee.unique_id = employee.unique_id;
        newEmployee.role = employee.role;
        newEmployee.designation = employee.designationId;
        newEmployee.department = employee.departmentId;
        newEmployee.username = employee.username;
        newEmployee.address = employee.address;
        newEmployee.id_card_number = employee.id_card_number;
        newEmployee.image = employee.image;
        newEmployee.phone_number = employee.phone_number;
        newEmployee.is_accepted = employee.is_accepted;
        newEmployee.is_deleted = false;
        newEmployee.password = employee.password;
        let backup_data = await connection.manager.save(newEmployee);

        ///

        employee = await connection.manager.findOne(Employee, User.id);
        employee.name = req.body.name ? req.body.name : employee.name;
        employee.id_card_number = req.body.id_card_number ? req.body.id_card_number : employee.id_card_number;
        employee.designation = req.body.designation ? req.body.designation : employee.designation;
        employee.department = req.body.department ? req.body.department : employee.department;
        employee.username = req.body.username ? req.body.username : employee.username;
        employee.address = req.body.address ? req.body.address : employee.address;
        employee.image = req.body.image ? req.body.image : employee.image;
        employee.phone_number = req.body.phone_number ? req.body.phone_number : employee.phone_number;
        res_data = await connection.manager.save(employee);
        console.log(res_data);

        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.EMPLOYEE_PROFILE_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.EMPLOYEE_PROFILE_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  deleteEmployee = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        let employee: any = await connection.manager.findOne(Employee, req.params.employee_id);
        employee.is_deleted = true
        await connection.manager.save(employee);
        res_data = employee;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.EMPLOYEE_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.EMPLOYEE_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }


  assignRole = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        let employee: any = await connection.manager.findOne(Employee, req.params.employee_id);
        employee.role = req.body.role ? req.body.role : employee.role;
        await connection.manager.save(employee);
        res_data = employee;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.EMPLOYEE_ROLE_UPDATE } };
      } else {
        message = message ? message : ResponseMessages.EMPLOYEE_ROLE_UPDATE_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }
  acceptEmployee = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        let employee: any = await connection.manager.findOne(Employee, req.params.employee_id);
        employee.is_accepted = true;
        await connection.manager.save(employee);
        res_data = employee;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.EMPLOYEE_ACCEPTED } };
      } else {
        message = message ? message : ResponseMessages.EMPLOYEE_ACCEPTED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }
}
export default new EmployeeServicesData();
