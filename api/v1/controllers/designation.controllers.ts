import { Request, Response } from "express";
import ResponseMessages from "../common/response.messages";
import Services from "../services/designation.services";

class DesignationControllersData {
  createDesignation = async (req: Request, res: Response) => {
    try {
      let employee = await Services.createDesignation(req);
      return res.status(employee.status_code).send(employee.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getAllDesignation = async (req: Request, res: Response) => {
    try {
      let designation: any = await Services.getAllDesignation();
      if (designation)
        return res.status(designation.status_code).send(designation.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  designationDetailsByDesignationId = async (req: Request, res: Response) => {
    try {
      let designation: any = await Services.designationDetailsByDesignationId(req);
      if (designation)
        return res.status(designation.status_code).send(designation.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  updateDesignationDetails = async (req: Request, res: Response) => {
    try {
      let designation = await Services.updateDesignationDetails(req);
      return res.status(designation.status_code).send(designation.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  deleteDesignation = async (req: Request, res: Response) => {
    try {

      let designation = await Services.deleteDesignation(req);
      return res.status(designation.status_code).send(designation.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
}
export default new DesignationControllersData();
