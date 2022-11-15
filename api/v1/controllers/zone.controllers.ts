import { Request, Response } from "express";
import responseMessages from "../common/response.messages";
import ResponseMessages from "../common/response.messages";
import utility, { Validation } from "../common/utility";
import Services from "../services/zone.services";
import { ZoneDataViewModel } from "../view_model/data";

class ZoneControllersData {
  createZone = async (req: Request, res: Response) => {
    try {
      let validated_data: Validation = await utility.validateAndConvert(ZoneDataViewModel, req.body);
      if (validated_data.error && validated_data.error.length > 0) {
        return res.status(400).send({
          success: false,
          message: responseMessages.VALIDATION_ERROR,
          data: validated_data.error[0]
        });
      } else {
        let employee = await Services.createZone(req,validated_data.data);
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

  getAllZone = async (req: Request, res: Response) => {
    try {
      let zone: any = await Services.getAllZone();
      if (zone)
        return res.status(zone.status_code).send(zone.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
  
  zoneDetailsByZoneId = async (req: Request, res: Response) => {
    try {
      let zone: any = await Services.zoneDetailsByZoneId(req);
      if (zone)
        return res.status(zone.status_code).send(zone.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  updateZoneDetails = async (req: Request, res: Response) => {
    try {

      let zone = await Services.updateZoneDetails(req);
      return res.status(zone.status_code).send(zone.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  deleteZone = async (req: Request, res: Response) => {
    try {

      let zone = await Services.deleteZone(req);
      return res.status(zone.status_code).send(zone.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };


  
  getZonecolors = async (req: Request, res: Response) => {
    try {
      let zone: any = await Services.getZonecolors();
      if (zone)
        return res.status(zone.status_code).send(zone.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

}
export default new ZoneControllersData();
