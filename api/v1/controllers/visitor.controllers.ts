import { Request, Response } from "express";
import common from "../common/constants/common";
import responseMessages from "../common/response.messages";
import ResponseMessages from "../common/response.messages";
import utility, { Validation } from "../common/utility";
import Services from "../services/visitor.services";
import { addVisitor } from "../view_model/visitors";

class VisitorControllersData {
  createVisitor = async (req: Request, res: Response) => {
    try {
      if (!req.files || !req.files.id_proof_file) {
        return res.status(400).send({ success: false, message: responseMessages.FILE_REQ });
      } else {
        let validated_data: Validation = await utility.validateAndConvert(addVisitor, req.body);
        if (validated_data.error && validated_data.error.length > 0) {
          return res.status(400).send({
            success: false,
            message: responseMessages.VALIDATION_ERROR,
            data: validated_data.error[0]
          });
        } else {
          let matches = req.body.image.match(common.base64ToFileExt) ?? [];
          if (matches.length != 3)
            return res.status(400).send({ success: false, message: responseMessages.IMG_REQ });
          let employee = await Services.createVisitor(req, validated_data.data, req.body.image);
          return res.status(employee.status_code).send(employee.data);
        }
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getAllVisitor = async (req: Request, res: Response) => {
    try {
      let visitor: any = await Services.getAllVisitor(req);
      return res.status(visitor.status_code).send(visitor.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  visitorDetailsByVisitorId = async (req: Request, res: Response) => {
    try {
      let visitor: any = await Services.visitorDetailsByVisitorId(req);
      return res.status(visitor.status_code).send(visitor.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  // updateVisitorDetails = async (req: Request, res: Response) => {
  //   try {
  //     let validated_data: Validation = await utility.validateAndConvert(updateVisitor, req.body);
  //     if (validated_data.error && validated_data.error.length > 0) {
  //       return res.status(400).send({
  //         success: false,
  //         message: responseMessages.VALIDATION_ERROR,
  //         data: validated_data.error[0]
  //       });
  //     } else {
  //       let visitor = await Services.updateVisitorDetails(req);
  //       return res.status(visitor.status_code).send(visitor.data);
  //     }
  //   } catch (error) {
  //     return res.status(500).send({
  //       success: false,
  //       message: ResponseMessages.ERROR_ISE,
  //       error
  //     });
  //   }
  // };


  deleteVisitor = async (req: Request, res: Response) => {
    try {
      let visitor = await Services.deleteVisitor(req);
      return res.status(visitor.status_code).send(visitor.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  recommendVisitor = async (req: Request, res: Response) => {
    try {
      let visitor = await Services.recommendVisitor(req);
      return res.status(visitor.status_code).send(visitor.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  approveVisitor = async (req: Request, res: Response) => {
    try {
      let visitor = await Services.approveVisitor(req);
      return res.status(visitor.status_code).send(visitor.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getVisitorReport = async (req: Request, res: Response) => {
    try {
      let visitor = await Services.getVisitorReport(req);
      return res.status(visitor.status_code).send(visitor.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

}
export default new VisitorControllersData();
