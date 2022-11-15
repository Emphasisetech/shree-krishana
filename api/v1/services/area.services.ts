import { Request } from "express";
import { Area } from "../models/area";
import ResponseMessages from "../common/response.messages";
import { ICommonServices } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
import { AddAreaViewModel } from "../view_model/data";
class AreaServicesData {
  createArea = async (req_body_data: AddAreaViewModel): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        const checkArea = await connection.manager.find(Area, { name: req_body_data.name });
        if (checkArea.length) {
          message = ResponseMessages.AREA_EXIST;
          return
        }
        let newArea = new Area();
        newArea.name = req_body_data.name;
        newArea.zone = req_body_data.zone;
        newArea.is_deleted = false;
        res_data = await connection.manager.save(newArea);
        message = ResponseMessages.AREA_CREATED
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.AREA_CREATED } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.AREA_CREATED_NOT;
        return { status_code, data: { success: false, data: res_data, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllArea = async (): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const areaRepo: any = await connection.getRepository(Area);
        let area = await areaRepo.createQueryBuilder("a")
          .leftJoinAndSelect("a.zone", "z")
          .select([
            "a.id as id", "a.name as name", "a.is_deleted as is_deleted",
            "z.id as zone_id", "z.name as zone", "z.color as zone_color",
          ])
          .execute();
        res_data = area
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.AREA_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.AREA_LIST_FOUND_NOT } };
      }
    } catch (error: any) {

      console.error("Error ", error);
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  areaDetailsByAreaId = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const area: any = await connection.manager.findOne(Area, req.params.area_id);
        res_data = area
        console.log(res_data);
        return
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.AREA_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.AREA_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  updateAreaDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection
        .then(async connection => {
          // const checkArea = await connection.manager.find(Area, { name: req.body.name });
          const repo: any = await connection.getRepository(Area);
          let checkArea = await repo.createQueryBuilder("area")
            .andWhere("area.name=:name", { name: req.body.name })
            .andWhere("area.id!=:id", { id: req.params.area_id })
            .execute();
          if (checkArea.length) {
            message = ResponseMessages.AREA_EXIST;
            return
          }
          let foundArea: any = await connection.manager.findOne(Area, req.params.area_id);
          foundArea.name = req.body.name ? req.body.name : foundArea.name;
          foundArea.zone = req.body.zone ? req.body.zone : foundArea.zone;
          res_data = await connection.manager.save(foundArea);
          return;
        }).catch(error => {
          console.error("Error ", error);
          return;
        });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.AREA_UPDATED } };
      } else {
        let status_code = message ? 400 : 200;
        message = message ? message : ResponseMessages.AREA_UPDATED_NOT;
        return { status_code, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  deleteArea = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection
        .then(async connection => {
          let area: any = await connection.manager.findOne(Area, req.params.area_id);
          area.is_deleted = true
          await connection.manager.save(area);
          res_data = area;
          return;
        }).catch(error => {
          console.error("Error ", error);
          return;
        });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.AREA_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.AREA_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  areasByZone = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const zone: any = await connection.manager.query(`SELECT name, id, priority, color from Zone WHERE id= ${req.params.zone_id}`)
        const areasRepo: any = await connection.getRepository(Area);
        res_data = await areasRepo.createQueryBuilder("a")
          .leftJoinAndSelect("a.zone", "z")
          .andWhere(`z.priority >= :priority`, { priority: zone[0].priority })
          .select(["a.id as id", "a.name as name"])
          .execute();
        return
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.AREA_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.AREA_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

}
export default new AreaServicesData();
