import { Request, Response } from "express";
import ResponseMessages from "../common/response.messages";
import Services from "../services/employee.services";
class EmployeeControllersData {

  findAll = async (req: Request, res: Response) => {
    try {
      let employee: any = await Services.getAllEmployees(req);
      if (employee)
        return res.status(employee.status_code).send(employee.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getEmployeeDetailsByEmployeeId = async (req: Request, res: Response) => {
    try {
      let employee: any = await Services.getEmployeeDetailsByEmployeeId(req);
      if (employee)
        return res.status(employee.status_code).send(employee.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  updateEmployeeDetails = async (req: Request, res: Response) => {
    try {

      let employee = await Services.updateEmployeeDetails(req);
      return res.status(employee.status_code).send(employee.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  deleteEmployee = async (req: Request, res: Response) => {
    try {
      let employee = await Services.deleteEmployee(req);
      return res.status(employee.status_code).send(employee.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  assignRole = async (req: Request, res: Response) => {
    try {
      let employee = await Services.assignRole(req);
      return res.status(employee.status_code).send(employee.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  acceptEmployee = async (req: Request, res: Response) => {
    try {
      let employee = await Services.acceptEmployee(req);
      return res.status(employee.status_code).send(employee.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };


}
export default new EmployeeControllersData();
