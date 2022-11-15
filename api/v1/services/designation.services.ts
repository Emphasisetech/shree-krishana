import { Request } from "express";
import { Designation } from "../models/designation";
import ResponseMessages from "../common/response.messages";
import { ICommonServices } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
class DesignationServicesData {
  createDesignation = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        const checkDesignation = await connection.manager.find(Designation, { name: req.body.name });
        if (checkDesignation.length) {
          message = ResponseMessages.DESIGNATION_EXIST;
          return
        }
        let newDesignation = new Designation();
        newDesignation.name = req.body.name;
        newDesignation.is_deleted = false;
        res_data = await connection.manager.save(newDesignation);
        message = ResponseMessages.DESIGNATION_CREATED
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.DESIGNATION_CREATED } };
      } else {
        message = message ? message : ResponseMessages.DESIGNATION_CREATED_NOT;
        return { status_code: 200, data: { success: false, data: res_data, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllDesignation = async () => {
    try {
      let res_data
      await connection.then(async connection => {
        const designations: Designation[] = await connection.manager.find(Designation);
        res_data = designations
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.DESIGNATION_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.DESIGNATION_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  designationDetailsByDesignationId = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const designation: any = await connection.manager.findOne(Designation, req.params.designation_id);
        res_data = designation
        console.log(res_data);
        return
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.DESIGNATION_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.DESIGNATION_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  updateDesignationDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        // const checkDesignation = await connection.manager.find(Designation, { name: req.body.name });
        const repo: any = await connection.getRepository(Designation);
        let checkDesignation = await repo.createQueryBuilder("d")
          .andWhere("d.name=:name", { name: req.body.name })
          .andWhere("d.id!=:id", { id: req.params.designation_id })
          .execute();
        if (checkDesignation.length) {
          message = ResponseMessages.DESIGNATION_EXIST;
          return
        }
        let foundDesignation: any = await connection.manager.findOne(Designation, req.params.designation_id);
        foundDesignation.name = req.body.name ? req.body.name : foundDesignation.name;
        foundDesignation.is_deleted = false
        res_data = await connection.manager.save(foundDesignation);
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.DESIGNATION_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.DESIGNATION_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  deleteDesignation = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        let designation: any = await connection.manager.findOne(Designation, req.params.designation_id);
        designation.is_deleted = true
        await connection.manager.save(designation);
        res_data = designation;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.DESIGNATION_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.DESIGNATION_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

}
export default new DesignationServicesData();
