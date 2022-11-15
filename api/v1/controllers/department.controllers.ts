import { Request, Response } from "express";
import ResponseMessages from "../common/response.messages";
import Services from "../services/department.services";

class DepartmentControllersData {
  createDepartment = async (req: Request, res: Response) => {
    try {
      let employee = await Services.createDepartment(req);
      return res.status(employee.status_code).send(employee.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getAllDepartment = async (req: Request, res: Response) => {
    try {
      let department: any = await Services.getAllDepartment();
      if (department)
        return res.status(department.status_code).send(department.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  departmentDetailsByDepartmentId = async (req: Request, res: Response) => {
    try {
      let department: any = await Services.departmentDetailsByDepartmentId(req);
      if (department)
        return res.status(department.status_code).send(department.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  updateDepartmentDetails = async (req: Request, res: Response) => {
    try {
      let department = await Services.updateDepartmentDetails(req);
      return res.status(department.status_code).send(department.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  deleteDepartment = async (req: Request, res: Response) => {
    try {
      let department = await Services.deleteDepartment(req);
      return res.status(department.status_code).send(department.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
}
export default new DepartmentControllersData();
