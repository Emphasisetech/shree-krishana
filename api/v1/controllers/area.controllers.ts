import { Request, Response } from "express";
import responseMessages from "../common/response.messages";
import ResponseMessages from "../common/response.messages";
import utility, { Validation } from "../common/utility";
import Services from "../services/area.services";
import { AddAreaViewModel } from "../view_model/data";

class AreaControllersData {
  createArea = async (req: Request, res: Response) => {
    try {
      let validated_data: Validation = await utility.validateAndConvert(AddAreaViewModel, req.body);
      if (validated_data.error && validated_data.error.length > 0) {
        return res.status(400).send({
          success: false,
          message: responseMessages.VALIDATION_ERROR,
          data: validated_data.error[0]
        });
      } else {
        let employee = await Services.createArea(validated_data.data);
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

  getAllArea = async (req: Request, res: Response) => {
    try {
      let area: any = await Services.getAllArea();
      return res.status(area.status_code).send(area.data);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  areaDetailsByAreaId = async (req: Request, res: Response) => {
    try {
      let area: any = await Services.areaDetailsByAreaId(req);
      if (area)
        return res.status(area.status_code).send(area.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  updateAreaDetails = async (req: Request, res: Response) => {
    try {
      let area = await Services.updateAreaDetails(req);
      return res.status(area.status_code).send(area.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  deleteArea = async (req: Request, res: Response) => {
    try {
      let area = await Services.deleteArea(req);
      return res.status(area.status_code).send(area.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  areasByZone = async (req: Request, res: Response) => {
    try {
      let area: any = await Services.areasByZone(req);
      if (area)
        return res.status(area.status_code).send(area.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

}
export default new AreaControllersData();
