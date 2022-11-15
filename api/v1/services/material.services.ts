import _ from "lodash";
import { v4 } from "uuid";
import moment from "moment"
import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import utility from "../common/utility";
import Path from "../common/constants/path";
import { Material } from "../models/material";
import ResponseMessages from "../common/response.messages";
import { ICommonServices, IPayloadUser, IMaterialDetails } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
import role from "../common/constants/role";

class MaterialServicesData {
  createMaterial = async (req: Request, reqBodyData: any, image_file: any): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        try {
          const checkDesignation = await connection.manager.find(Material, { serial_number: req.body.serial_number });
          if (checkDesignation.length) {
            message = ResponseMessages.MATERIAL_EXIST;
            return;
          }
          let unique_id = v4();
          let date = moment().format("YYYY_MM_DD");
          let file_path = `${Path.material}/${User.unique_id}/${date}`

          let file = await utility.ConvertBase64ToFile(image_file, file_path, unique_id);
         
          let new_material = new Material();
          new_material.name = req.body.name;
          new_material.type = req.body.type;
          new_material.serial_number = req.body.serial_number;
          new_material.file = file.name;
          new_material.purpose = req.body.purpose;
          new_material.in_date = req.body.in_date;
          new_material.out_date = req.body.out_date;
          new_material.zone = req.body.zone;
          new_material.area_permitted = reqBodyData.area_permitted.map((id: number) => ({ id }));
          new_material.carry_by = req.body.carry_by;
          new_material.added_by = User.id;
          new_material.remarks = req.body.remarks;

          res_data = await connection.manager.save(new_material);

          res_data.file = `${process.env.BASE_URL}${file_path}/${file.name}`;
          message = ResponseMessages.MATERIAL_CREATED;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.MATERIAL_CREATED } };
      } else {
        message = message ? message : ResponseMessages.MATERIAL_CREATED_NOT;
        return { status_code: 200, data: { success: false, data: res_data, message } };
      }
    } catch (err) {
      console.log(err);
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllMaterial = async () => {
    try {
      let materials: any[] = []
      await connection.then(async connection => {
        try {
          materials = await connection.manager.find(Material, { relations: ["added_by", "recommend_by", "approved_by", "carry_by", "zone", "area_permitted"] });
          return;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (materials) {

        let data: any[] = [];
        materials.forEach((e: any) => {
          let tepmData = {
            ...e,
            in_date: e.in_date.slice(0, 10),
            in_time: e.in_date.slice(11, 16),
            out_date: e.out_date.slice(0, 10),
            out_time: e.out_date.slice(11, 16),
            added_by_id: e.added_by ? e.added_by.id : null,
            added_by_name: e.added_by ? e.added_by.name : null,
            added_by_unique_id: e.added_by ? e.added_by.unique_id : null,
            recommend_by_id: e.recommend_by ? e.recommend_by.id : null,
            recommend_by_name: e.recommend_by ? e.recommend_by.name : null,
            approved_by_id: e.approved_by ? e.approved_by.id : null,
            approved_by_name: e.approved_by ? e.approved_by.name : null,
            carry_by_id: e.carry_by ? e.carry_by.id : null,
            carry_by_name: e.carry_by ? e.carry_by.name : null,
            zone_id: e.zone ? e.zone.id : null,
            zone_name: e.zone ? e.zone.name : null,
            zone_color: e.zone ? e.zone.color : null,
          }
          tepmData.file = tepmData.file ? `${process.env.BASE_URL}${Path.material}/${tepmData.added_by_unique_id}/${tepmData.file}` : '';
          delete tepmData.added_by;
          delete tepmData.recommend_by;
          delete tepmData.approved_by;
          delete tepmData.person_to_meet;
          delete tepmData.id_proof_type;
          delete tepmData.zone;
          data.push(tepmData);
        });

        return { status_code: 200, data: { success: true, data, message: ResponseMessages.MATERIAL_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.MATERIAL_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  materialDetailsByMaterialId = async (req: Request): Promise<ICommonServices> => {
    try {
      let material: any;
      await connection.then(async connection => {
        material = await connection.manager.findOne(Material, parseInt(req.params.material_id), { relations: ["added_by", "recommend_by", "approved_by", "carry_by", "zone", "area_permitted"] });
        return;

      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (material) {
        let data = {
          ...material,
          in_date: material.in_date.slice(0, 10),
          in_time: material.in_date.slice(11, 16),
          out_date: material.out_date.slice(0, 10),
          out_time: material.out_date.slice(11, 16),
          added_by_id: material.added_by ? material.added_by.id : null,
          added_by_name: material.added_by ? material.added_by.name : null,
          added_by_unique_id: material.added_by ? material.added_by.unique_id : null,
          recommend_by_id: material.recommend_by ? material.recommend_by.id : null,
          recommend_by_name: material.recommend_by ? material.recommend_by.name : null,
          approved_by_id: material.approved_by ? material.approved_by.id : null,
          approved_by_name: material.approved_by ? material.approved_by.name : null,
          carry_by_id: material.carry_by ? material.carry_by.id : null,
          carry_by_name: material.carry_by ? material.carry_by.name : null,
          zone_id: material.zone ? material.zone.id : null,
          zone_name: material.zone ? material.zone.name : null,
          zone_color: material.zone ? material.zone.color : null,
        }
        data.file = data.file ? `${process.env.BASE_URL}${Path.material}/${data.added_by_unique_id}/${data.file}` : '';
        delete data.added_by;
        delete data.recommend_by;
        delete data.approved_by;
        delete data.person_to_meet;
        delete data.id_proof_type;
        delete data.zone;

        material.file = material.file ? `${process.env.BASE_URL}${Path.material}/${material.added_by_unique_id}/${material.file}` : '';
        return { status_code: 200, data: { success: true, data, message: ResponseMessages.MATERIAL_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.MATERIAL_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      console.log(error);

      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  recommendMaterial = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser;
      let res_data;
      let message: string = '';
      if ([role.ADMIN, role.RECOMMENDER].indexOf(User.role) >= 0) {
        await connection.then(async connection => {
          try {
            let foundMaterial: any = await connection.manager.findOne(Material, req.params.material_id);
            foundMaterial.recommend_by = User.id;
            res_data = await connection.manager.save(foundMaterial);
            return;
          } catch (err) {
            console.error("Error ", err);
            return;
          }
        }).catch(error => {
          console.error("Error ", error);
          return;
        });
      } else {
        message = ResponseMessages.MATERIAL_RECOMMENDED_NOT_AUTH;
      }
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.MATERIAL_RECOMMENDED } };
      } else {
        message = message ? message : ResponseMessages.MATERIAL_RECOMMENDED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  approveMaterial = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser;
      let res_data;
      let message: string = '';
      if ([role.ADMIN, role.APPROVER].indexOf(User.role) >= 0) {
        await connection.then(async connection => {
          try {
            let foundMaterial: any = await connection.manager.findOne(Material, req.params.material_id);
            foundMaterial.approved_by = User.id;
            foundMaterial.is_approved = true;
            res_data = await connection.manager.save(foundMaterial);
            return;
          } catch (err) {
            console.error("Error ", err);
            return;
          }
        }).catch(error => {
          console.error("Error ", error);
          return;
        });
      } else {
        message = ResponseMessages.MATERIAL_APPROVED_NOT_AUTH;
      }
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.MATERIAL_APPROVED } };
      } else {
        message = message ? message : ResponseMessages.MATERIAL_APPROVED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }


  getMaterialReport = async (req: Request) => {
    try {
      let materials: IMaterialDetails[] = []
      let { from_date, to_date } = req.query
      await connection.then(async connection => {
        try {
          const materialsRepo: any = await connection.getRepository(Material);

          materials = await materialsRepo.createQueryBuilder("m")
            .leftJoinAndSelect("m.added_by", "added_by")
            .leftJoinAndSelect("m.recommend_by", "recommend_by")
            .leftJoinAndSelect("m.approved_by", "approved_by")
            .leftJoinAndSelect("m.carry_by", "carry_by")
            .leftJoinAndSelect("m.zone", "zone")
            .leftJoinAndSelect("m.area_permitted", "area_permitted")
            .andWhere(`m.in_date >= :startDate AND m.in_date <= :endDate `, { startDate: from_date, endDate: to_date })
            .select(["m.id as id", "m.name as name", "m.type as type", "m.serial_number as serial_number", "m.purpose as purpose", "m.file as file", "m.in_date as in_date", "m.out_date as out_date", "m.is_recommend as is_recommend", "m.is_approved as is_approved", "m.is_deleted as is_deleted", "m.remarks as remarks",
              "added_by.id", "added_by.name", "added_by.unique_id",
              "recommend_by.id", "recommend_by.name",
              "approved_by.id", "approved_by.name",
              "carry_by.id", "carry_by.name",
              "area_permitted.id", "area_permitted.name",
              "zone.id", "zone.name", "zone.color",
            ])
            .execute();
          return;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (materials) {
        materials.forEach((e: IMaterialDetails) => {
          e.image = e.image ? `${process.env.BASE_URL}${Path.material}/${e.added_by_unique_id}/${e.image}` : '';
          e.file = e.file ? `${process.env.BASE_URL}${Path.material}/${e.added_by_unique_id}/${e.file}` : '';
        })
        return { status_code: 200, data: { success: true, data: materials, message: ResponseMessages.MATERIAL_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.MATERIAL_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      console.log(error);

      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };


  deleteMaterial = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser
      let res_data;
      await connection.then(async connection => {
        try {
          let material: any = await connection.manager.findOne(Material, req.params.material_id);
          material.is_deleted = true;
          material.deleted_by = User.id;
          await connection.manager.save(material);
          res_data = material;
          return;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.MATERIAL_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.MATERIAL_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  updateMaterialDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        try {
          let foundMaterial: any = await connection.manager.findOne(Material, req.params.material_id);
          foundMaterial.name = req.body.name ? req.body.name : foundMaterial.name;
          res_data = await connection.manager.save(foundMaterial);
          return;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.MATERIAL_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.MATERIAL_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

}
export default new MaterialServicesData();
