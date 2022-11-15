import { Request } from "express";
import { IdProofType } from "../models/idProofType";
import ResponseMessages from "../common/response.messages";
import { ICommonServices, IMasterData } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
class UserServicesData {
  createIdProveType = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        const checkIdProveType = await connection.manager.find(IdProofType, { name: req.body.name });
        if (checkIdProveType.length) {
          message = ResponseMessages.ID_PROVE_TYPE_EXIST;
          return
        }
        let newIdProveType = new IdProofType();
        newIdProveType.name = req.body.name;
        newIdProveType.is_deleted = false;
        res_data = await connection.manager.save(newIdProveType);
        message = ResponseMessages.ID_PROVE_TYPE_CREATED
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.ID_PROVE_TYPE_CREATED } };
      } else {
        message = message ? message : ResponseMessages.ID_PROVE_TYPE_CREATED_NOT;
        return { status_code: 200, data: { success: false, data: res_data, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllIdProveType = async () => {
    try {
      let res_data
      await connection.then(async connection => {
        const idProveTypes: IdProofType[] = await connection.manager.find(IdProofType);
        res_data = idProveTypes
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.ID_PROVE_TYPE_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.ID_PROVE_TYPE_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  idProveTypeDetailsByIdProveTypeId = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const id_proof_type: any = await connection.manager.findOne(IdProofType, req.params.id_proof_type_id);
        res_data = id_proof_type
        console.log(res_data);
        return
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.ID_PROVE_TYPE_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.ID_PROVE_TYPE_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  updateIdProveTypeDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
          // const checkIdProveType = await connection.manager.find(IdProofType, { name: req.body.name });
          const repo: any = await connection.getRepository(IdProofType);
          let checkIdProveType = await repo.createQueryBuilder("idp")
            .andWhere("idp.name=:name", { name: req.body.name })
            .andWhere("idp.id!=:id", { id: req.params.idProofType_id })
            .execute();
          if (checkIdProveType.length) {
            message = ResponseMessages.ID_PROVE_TYPE_EXIST;
            return
          }
          let foundIdProveType: any = await connection.manager.findOne(IdProofType, req.params.id_proof_type_id);
          foundIdProveType.name = req.body.name ? req.body.name : foundIdProveType.name;
          foundIdProveType.is_deleted = false
          res_data = await connection.manager.save(foundIdProveType);
          return;
        }).catch(error => {
          console.error("Error ", error);
          return;
        });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.ID_PROVE_TYPE_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.ID_PROVE_TYPE_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  deleteIdProveType = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
          let id_proof_type: any = await connection.manager.findOne(IdProofType, req.params.id_proof_type_id);
          id_proof_type.is_deleted = true
          await connection.manager.save(id_proof_type);
          res_data = id_proof_type;
          return;
        }).catch(error => {
          console.error("Error ", error);
          return;
        });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.ID_PROVE_TYPE_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.ID_PROVE_TYPE_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

}
export default new UserServicesData();
