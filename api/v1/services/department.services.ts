import { Request } from "express";
import { Department } from "../models/department";
import ResponseMessages from "../common/response.messages";
import { ICommonServices } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
class DepartmentServicesData {
  createDepartment = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        const checkDepartment = await connection.manager.find(Department, { name: req.body.name });
        if (checkDepartment.length) {
          message = ResponseMessages.DEPARTMENT_EXIST;
          return
        }
        let newDepartment = new Department();
        newDepartment.name = req.body.name;
        newDepartment.is_deleted = false;
        res_data = await connection.manager.save(newDepartment);
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.DEPARTMENT_CREATED } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.DEPARTMENT_CREATED_NOT;
        return { status_code, data: { success: false, data: res_data, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllDepartment = async () => {
    try {
      let res_data
      await connection.then(async connection => {
        const departments: Department[] = await connection.manager.find(Department);
        res_data = departments
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.DEPARTMENT_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.DEPARTMENT_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  departmentDetailsByDepartmentId = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const department: any = await connection.manager.findOne(Department, req.params.department_id);
        res_data = department
        console.log(res_data);
        return
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.DEPARTMENT_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.DEPARTMENT_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  updateDepartmentDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        // const checkDepartment = await connection.manager.find(Department, { name: req.body.name });
        const repo: any = await connection.getRepository(Department);
        let checkDepartment = await repo.createQueryBuilder("d")
          .andWhere("d.name=:name", { name: req.body.name })
          .andWhere("d.id!=:id", { id: req.params.department_id })
          .execute();
        if (checkDepartment.length) {
          message = ResponseMessages.DEPARTMENT_EXIST;
          return
        }
        let foundDepartment: any = await connection.manager.findOne(Department, req.params.department_id);
        foundDepartment.name = req.body.name ? req.body.name : foundDepartment.name;
        foundDepartment.is_deleted = false
        res_data = await connection.manager.save(foundDepartment);
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.DEPARTMENT_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.DEPARTMENT_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  deleteDepartment = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        let department: any = await connection.manager.findOne(Department, req.params.department_id);
        department.is_deleted = true
        await connection.manager.save(department);
        res_data = department;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.DEPARTMENT_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.DEPARTMENT_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

}
export default new DepartmentServicesData();
