import { Request } from "express";
import { Zone } from "../models/zone";
import ResponseMessages from "../common/response.messages";
import { ICommonServices } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
import { ZoneDataViewModel } from "../view_model/data";

class UserServicesData {
  createZone = async (req: Request, req_body_data: ZoneDataViewModel): Promise<ICommonServices> => {
    try {
      let res_data
      let message: string = '';
      await connection.then(async connection => {
        const checkZone = await connection.manager.find(Zone, {
          where: [
            { name: req_body_data.name },
            { priority: req_body_data.priority },
            { color: req_body_data.color }
          ],
        });
        if (checkZone.length) {
          message = ResponseMessages.ZONE_EXIST;
          return
        }
        let newZone = new Zone();
        newZone.name = req.body.name;
        newZone.priority = req.body.priority;
        newZone.color = req.body.color;
        newZone.is_deleted = false;
        res_data = await connection.manager.save(newZone);
        message = ResponseMessages.ZONE_CREATED
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.ZONE_CREATED } };
      } else {
        message = message ? message : ResponseMessages.ZONE_CREATED_NOT;
        return { status_code: 200, data: { success: false, data: res_data, message } };
      }
    } catch (error) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllZone = async () => {
    try {
      let res_data
      await connection.then(async connection => {
        const zones: Zone[] = await connection.manager.find(Zone);
        res_data = zones
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.ZONE_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.ZONE_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  zoneDetailsByZoneId = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        const zone: any = await connection.manager.findOne(Zone, req.params.zone_id);
        res_data = zone
        console.log(res_data);
        return
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.ZONE_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.ZONE_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  updateZoneDetails = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        // const checkZone = await connection.manager.find(Zone, { name: req.body.name });
        const repo: any = await connection.getRepository(Zone);
        let checkZone = await repo.createQueryBuilder("zone")
          .andWhere("zone.name=:name", { name: req.body.name })
          .andWhere("zone.id!=:id", { id: req.params.zone_id })
          .execute();
        if (checkZone.length) {
          message = ResponseMessages.ZONE_EXIST;
          return
        }
        let foundZone: any = await connection.manager.findOne(Zone, req.params.zone_id);
        foundZone.name = req.body.name ? req.body.name : foundZone.name;
        foundZone.color = req.body.color ? req.body.color : foundZone.color;
        foundZone.priority = req.body.priority ? req.body.priority : foundZone.priority;
        foundZone.is_deleted = false
        res_data = await connection.manager.save(foundZone);
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.ZONE_UPDATED } };
      } else {
        message = message ? message : ResponseMessages.ZONE_UPDATED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  deleteZone = async (req: Request): Promise<ICommonServices> => {
    try {
      let res_data
      await connection.then(async connection => {
        let zone: any = await connection.manager.findOne(Zone, req.params.zone_id);
        zone.is_deleted = true
        await connection.manager.save(zone);
        res_data = zone;
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.ZONE_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.ZONE_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }


  getZonecolors = async () => {
    try {
      let res_data
      await connection.then(async connection => {

        res_data = [
          {
            name: 'Yellow',
            code: '#F7E940',
          },
          {
            name: 'Red',
            code: '#F75555',
          },
          {
            name: 'Green',
            code: '#BDF552',
          },
          {
            name: 'Blue',
            code: '#5DA3F5',
          }
        ]
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.ZONE_COLOR_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, data: res_data, message: ResponseMessages.ZONE_COLOR_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

}
export default new UserServicesData();
