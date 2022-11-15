import { Request, Response } from "express";
import common from "../common/constants/common";
import responseMessages from "../common/response.messages";
import ResponseMessages from "../common/response.messages";
import utility, { Validation } from "../common/utility";
import Services from "../services/material.services";
import { addMatiral } from "../view_model/matiral";

class MaterialControllersData {
  createMaterial = async (req: Request, res: Response) => {
    try {      
        let validated_data: Validation = await utility.validateAndConvert(addMatiral, req.body);
        if (validated_data.error && validated_data.error.length > 0) {
          return res.status(400).send({
            success: false,
            message: responseMessages.VALIDATION_ERROR,
            data: validated_data.error[0]
          });
        } else {
          let matches = req.body.file.match(common.base64ToFileExt) ?? [];
          if (matches.length != 3)
            return res.status(400).send({ success: false, message: responseMessages.FILE_REQ });
          let employee = await Services.createMaterial(req, validated_data.data, req.body.file);
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

  getAllMaterial = async (req: Request, res: Response) => {
    try {
      let material: any = await Services.getAllMaterial();
      return res.status(material.status_code).send(material.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  materialDetailsByMaterialId = async (req: Request, res: Response) => {
    try {
      let material: any = await Services.materialDetailsByMaterialId(req);
      return res.status(material.status_code).send(material.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };


  recommendMaterial = async (req: Request, res: Response) => {
    try {
      let material = await Services.recommendMaterial(req);
      return res.status(material.status_code).send(material.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getMaterialReport = async (req: Request, res: Response) => {
    try {
      let material = await Services.getMaterialReport(req);
      return res.status(material.status_code).send(material.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
  
  approveMaterial = async (req: Request, res: Response) => {
    try {
      let material = await Services.approveMaterial(req);
      return res.status(material.status_code).send(material.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
  
  deleteMaterial = async (req: Request, res: Response) => {
    try {
      let material = await Services.deleteMaterial(req);
      return res.status(material.status_code).send(material.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
  

  updateMaterialDetails = async (req: Request, res: Response) => {
    try {
      let material = await Services.updateMaterialDetails(req);
      return res.status(material.status_code).send(material.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
  
}
export default new MaterialControllersData();
