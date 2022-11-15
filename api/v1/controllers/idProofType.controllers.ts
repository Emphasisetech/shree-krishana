import { Request, Response } from "express";
import ResponseMessages from "../common/response.messages";
import Services from "../services/idProofType.services";

class IdProveTypeControllersData {
  createIdProveType = async (req: Request, res: Response) => {
    try {
      let employee = await Services.createIdProveType(req);
      return res.status(employee.status_code).send(employee.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  getAllIdProveType = async (req: Request, res: Response) => {
    try {
      let id_proof_type: any = await Services.getAllIdProveType();
      if (id_proof_type)
        return res.status(id_proof_type.status_code).send(id_proof_type.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  idProveTypeDetailsByIdProveTypeId = async (req: Request, res: Response) => {
    try {
      let id_proof_type: any = await Services.idProveTypeDetailsByIdProveTypeId(req);
      if (id_proof_type)
        return res.status(id_proof_type.status_code).send(id_proof_type.data);
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  updateIdProveTypeDetails = async (req: Request, res: Response) => {
    try {

      let id_proof_type = await Services.updateIdProveTypeDetails(req);
      return res.status(id_proof_type.status_code).send(id_proof_type.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };

  deleteIdProveType = async (req: Request, res: Response) => {
    try {

      let id_proof_type = await Services.deleteIdProveType(req);
      return res.status(id_proof_type.status_code).send(id_proof_type.data);

    } catch (error) {
      return res.status(500).send({
        success: false,
        message: ResponseMessages.ERROR_ISE,
        error
      });
    }
  };
}
export default new IdProveTypeControllersData();
