import _ from "lodash";
import { v4 } from "uuid";
import moment from "moment"
import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import utility from "../common/utility";
import Path from "../common/constants/path";
import { Visitor } from "../models/visitor";
import ResponseMessages from "../common/response.messages";
import { ICommonServices, IMataData, IPayloadUser, IVisitorDetails, IVisitorDetails1 } from "../interfaces/data.interfaces";
import { connection } from "../../../connection/connection";
import role from "../common/constants/role";
import common from "../common/constants/common";

class visitorServicesData {
  createVisitor = async (req: Request, reqBodyData: any, image_file: any): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser
      let res_data;
      let message: string = '';
      await connection.then(async connection => {
        try {
          const checkDesignation = await connection.manager.find(Visitor, { id_proof_number: reqBodyData.id_proof_number, in_date: reqBodyData.in_date });
          if (checkDesignation.length) {
            message = ResponseMessages.VISITOR_EXIST;
            return;
          }
          let unique_id = v4();
          let date = moment().format("YYYY_MM_DD");
          let file_path = `${Path.visitor}/${User.unique_id}/${date}`;
          let image = await utility.ConvertBase64ToFile(image_file, file_path, unique_id);
          let id_proof_file: UploadedFile = <UploadedFile>req.files?.id_proof_file;
          let new_id_proof_file_name = `${unique_id}.${_.split(id_proof_file.name, ".")[1]}`;
          let id_proof_file_path = `${Path.visitor_id_proof}/${User.unique_id}/${date}`
          let id_card_file_link = await utility.saveFile(id_proof_file, id_proof_file_path, new_id_proof_file_name) ? `${date}/${new_id_proof_file_name}` : '';

          let new_visitor = new Visitor();
          new_visitor.name = reqBodyData.name;
          new_visitor.organization = reqBodyData.organization;
          new_visitor.designation = reqBodyData.designation;
          new_visitor.id_proof_type = reqBodyData.id_proof_type;
          new_visitor.id_proof_number = reqBodyData.id_proof_number;
          new_visitor.person_to_meet = reqBodyData.person_to_meet;
          new_visitor.purpose = reqBodyData.purpose;
          new_visitor.in_date = reqBodyData.in_date;
          new_visitor.out_date = reqBodyData.out_date;
          new_visitor.zone = reqBodyData.zone;
          new_visitor.area_permitted = reqBodyData.area_permitted.map((id: number) => ({ id }));
          new_visitor.remarks = reqBodyData.remarks;
          new_visitor.is_deleted = false;
          new_visitor.image = image.name;
          new_visitor.id_proof_file = id_card_file_link;
          new_visitor.added_by = User.id;

          res_data = await connection.manager.save(new_visitor);
          console.log(image_file);

          res_data.image = image_file ? `${process.env.BASE_URL}${file_path}/${image.name}` : '';
          res_data.id_proof_file = `${process.env.BASE_URL}${id_proof_file_path}/${new_id_proof_file_name}`;
          message = ResponseMessages.VISITOR_CREATED;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (res_data) {
        return { status_code: 200, data: { success: true, data: res_data, message: ResponseMessages.VISITOR_CREATED } };
      } else {
        message = message ? message : ResponseMessages.VISITOR_CREATED_NOT;
        return { status_code: 200, data: { success: false, data: res_data, message } };
      }
    } catch (err) {
      console.log(err);
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  getAllVisitor = async (req: Request) => {
    try {
      let User = req.user as IPayloadUser;
      let query: IMataData = req.query;
      let visitors: any[] = []
      let page_number = query.page_number ? parseInt(query.page_number) : common.PAGE_NUM;
      let page_size = query.page_size ? parseInt(query.page_size) : common.PAGE_SIZE;
      let skip = page_size * (page_number - 1);
      let take = page_size + 1
      console.log(skip,);

      await connection.then(async connection => {
        try {
          if (User.role == role.USER) {
            visitors = await connection.manager.find(Visitor, {
              order: { id: "DESC" },
              skip,
              take,
              where: { added_by: User.id, is_deleted: false },
              relations: ["added_by", "recommend_by", "approved_by", "person_to_meet", "id_proof_type", "zone", "area_permitted"]
            });
          } else {
            visitors = await connection.manager.find(Visitor, {
              order: { id: "DESC" },
              skip,
              take: page_size + 1,
              where: { is_deleted: false },
              relations: ["added_by", "recommend_by", "approved_by", "person_to_meet", "id_proof_type", "zone", "area_permitted"]
            });
          }
          return;
        } catch (err) {
          console.error("Error ", err);
          return;
        }
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (visitors) {
        let data: IVisitorDetails1[] = [];
        visitors.forEach((e: any) => {
          e.image = e.image ? `${process.env.BASE_URL}${Path.visitor}/${e.added_by_unique_id}/${e.image}` : '';
          e.id_proof_file = e.id_proof_file ? `${process.env.BASE_URL}${Path.visitor_id_proof}/${e.added_by_unique_id}/${e.id_proof_file}` : '';
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
            person_to_meet_id: e.person_to_meet ? e.person_to_meet.id : null,
            person_to_meet_name: e.person_to_meet ? e.person_to_meet.name : null,
            // id_proof_type_id: e.id_proof_type ? e.id_proof_type.id : null,
            // id_proof_type_name: e.id_proof_type ? e.id_proof_type.name : null,
            zone_id: e.zone ? e.zone.id : null,
            zone_name: e.zone ? e.zone.name : null,
            zone_color: e.zone ? e.zone.color : null,
          }
          delete tepmData.added_by;
          delete tepmData.recommend_by;
          delete tepmData.approved_by;
          delete tepmData.person_to_meet;
          delete tepmData.id_proof_type;
          delete tepmData.zone;
          data.push(tepmData)
        })
        console.log(page_size, data.length, page_size > data.length ? false : true);
        let is_next = false;
        
        if (data.length > page_size) {
          is_next = true
          data.pop();
        }
        let metaData = { page_size: page_size, page_number: page_number, is_next };

        return { status_code: 200, data: { metaData, success: true, data, message: ResponseMessages.VISITOR_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.VISITOR_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };

  visitorDetailsByVisitorId = async (req: Request): Promise<ICommonServices> => {
    try {
      let visitor: any;
      await connection.then(async connection => {
        visitor = await connection.manager.findOne(Visitor, parseInt(req.params.visitor_id), { relations: ["added_by", "recommend_by", "approved_by", "person_to_meet", "id_proof_type", "zone", "area_permitted"] });
        return;
      }).catch(error => {
        console.error("Error ", error);
        return;
      });
      if (visitor) {

        visitor.image = visitor.image ? `${process.env.BASE_URL}${Path.visitor}/${visitor.added_by.unique_id}/${visitor.image}` : '';
        visitor.id_proof_file = visitor.id_proof_file ? `${process.env.BASE_URL}${Path.visitor_id_proof}/${visitor.added_by.unique_id}/${visitor.id_proof_file}` : '';

        let data: IVisitorDetails1 = {
          ...visitor,
          in_date: visitor.in_date.slice(0, 10),
          in_time: visitor.in_date ? ((parseInt(visitor.in_date.slice(11, 13)) > 24 || parseInt(visitor.in_date.slice(11, 13)) < 12) ? visitor.in_date.slice(11, 16) + ' AM' : visitor.in_date.slice(11, 16) + ' PM') : '',
          out_date: visitor.out_date.slice(0, 10),
          out_time: visitor.out_date ? ((parseInt(visitor.out_date.slice(11, 13)) > 24 || parseInt(visitor.out_date.slice(11, 13)) < 12) ? visitor.out_date.slice(11, 16) + ' AM' : visitor.out_date.slice(11, 16) + ' PM') : '',
          added_by_id: visitor.added_by ? visitor.added_by.id : null,
          added_by_name: visitor.added_by ? visitor.added_by.name : null,
          added_by_unique_id: visitor.added_by ? visitor.added_by.unique_id : null,
          recommend_by_id: visitor.recommend_by ? visitor.recommend_by.id : null,
          recommend_by_name: visitor.recommend_by ? visitor.recommend_by.name : null,
          approved_by_id: visitor.approved_by ? visitor.approved_by.id : null,
          approved_by_name: visitor.approved_by ? visitor.approved_by.name : null,
          person_to_meet_id: visitor.person_to_meet ? visitor.person_to_meet.id : null,
          person_to_meet_name: visitor.person_to_meet ? visitor.person_to_meet.name : null,
          id_proof_type_id: visitor.id_proof_type ? visitor.id_proof_type.id : null,
          id_proof_type_name: visitor.id_proof_type ? visitor.id_proof_type.name : null,
          zone_id: visitor.zone ? visitor.zone.id : null,
          zone_name: visitor.zone ? visitor.zone.name : null,
          zone_color: visitor.zone ? visitor.zone.color : null,
        }
        delete data.added_by;
        delete data.recommend_by;
        delete data.approved_by;
        delete data.person_to_meet;
        delete data.id_proof_type;
        delete data.zone;

        return { status_code: 200, data: { success: true, data, message: ResponseMessages.VISITOR_DETAIL_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.VISITOR_DETAIL_FOUND_NOT } };
      }
    } catch (error: any) {
      console.log(error);
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }

  };

  // updateVisitorDetails = async (req: Request): Promise<ICommonServices> => {
  //   try {
  //     let res_data;
  //     let message: string = '';
  //     await connection.then(async connection => {
  //       try {
  //         let foundVisitor: any = await connection.manager.findOne(Visitor, req.params.visitor_id);
  //         foundVisitor.name = req.body.name ? req.body.name : foundVisitor.name;
  //         res_data = await connection.manager.save(foundVisitor);
  //         return;
  //       } catch (err) {
  //         console.error("Error ", err);
  //         return;
  //       }
  //     }).catch(error => {
  //       console.error("Error ", error);
  //       return;
  //     });
  //     if (res_data) {
  //       return { status_code: 200, data: { success: true, message: ResponseMessages.VISITOR_UPDATED } };
  //     } else {
  //       message = message ? message : ResponseMessages.VISITOR_UPDATED_NOT;
  //       return { status_code: 200, data: { success: false, message } };
  //     }
  //   } catch (error: any) {
  //     return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
  //   }
  // }

  deleteVisitor = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser
      let res_data;
      await connection.then(async connection => {
        try {
          let visitor: any = await connection.manager.findOne(Visitor, req.params.visitor_id);
          visitor.is_deleted = true;
          visitor.deleted_by = User.id;
          await connection.manager.save(visitor);
          res_data = visitor;
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
        return { status_code: 200, data: { success: true, message: ResponseMessages.VISITOR_DELETED } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.VISITOR_DELETED_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  recommendVisitor = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser;
      let res_data;
      let message: string = '';
      if ([role.ADMIN, role.APPROVER, role.RECOMMENDER].indexOf(User.role) >= 0) {
        await connection.then(async connection => {
          try {
            let foundVisitor: any = await connection.manager.findOne(Visitor, req.params.visitor_id);
            foundVisitor.is_recommend = true;
            foundVisitor.recommend_by = User.id;
            res_data = await connection.manager.save(foundVisitor);
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
        message = ResponseMessages.VISITOR_RECOMMENDED_NOT_AUTH;
      }
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.VISITOR_RECOMMENDED } };
      } else {
        message = message ? message : ResponseMessages.VISITOR_RECOMMENDED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }

  approveVisitor = async (req: Request): Promise<ICommonServices> => {
    try {
      let User = req.user as IPayloadUser;
      let res_data;
      let message: string = '';
      if ([role.ADMIN, role.APPROVER].indexOf(User.role) >= 0) {
        await connection.then(async connection => {
          try {
            let foundVisitor: any = await connection.manager.findOne(Visitor, req.params.visitor_id);
            foundVisitor.approved_by = User.id;
            foundVisitor.is_approved = true;
            res_data = await connection.manager.save(foundVisitor);
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
        message = ResponseMessages.VISITOR_APPROVED_NOT_AUTH;
      }
      if (res_data) {
        return { status_code: 200, data: { success: true, message: ResponseMessages.VISITOR_APPROVED } };
      } else {
        message = message ? message : ResponseMessages.VISITOR_APPROVED_NOT;
        return { status_code: 200, data: { success: false, message } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  }


  getVisitorReport = async (req: Request) => {
    try {
      let visitors: IVisitorDetails[] = []
      let { from_date, to_date } = req.query
      await connection.then(async connection => {
        try {
          const visitorsRepo: any = await connection.getRepository(Visitor);

          visitors = await visitorsRepo.createQueryBuilder("v")
            .leftJoinAndSelect("v.added_by", "added_by")
            .leftJoinAndSelect("v.recommend_by", "recommend_by")
            .leftJoinAndSelect("v.approved_by", "approved_by")
            .leftJoinAndSelect("v.person_to_meet", "person_to_meet")
            .leftJoinAndSelect("v.id_proof_type", "id_proof_type")
            .leftJoinAndSelect("v.area_permitted", "area_permitted")
            .leftJoinAndSelect("v.zone", "zone")
            .andWhere(`v.in_date >= :startDate AND v.in_date <= :endDate `, { startDate: from_date, endDate: to_date })
            .orderBy("v.in_date", "ASC")
            // .orderBy("v.in_date as in_date", "DESC")
            .select(["v.id as id", "v.name as name", "v.organization as organization", "v.id_proof_number as id_proof_number", "v.purpose as purpose", "v.image as image", "v.id_proof_file as id_proof_file", "v.in_date as in_date", "v.out_date as out_date", "v.is_recommend as is_recommend", "v.is_approved as is_approved", "v.is_deleted as is_deleted", "v.remarks as remarks", "v.designation as designation",
              "added_by.id", "added_by.name", "added_by.unique_id",
              "recommend_by.id", "recommend_by.name",
              "approved_by.id", "approved_by.name",
              "person_to_meet.id", "person_to_meet.name",
              "id_proof_type.id", "id_proof_type.name",
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
      if (visitors) {
        visitors.forEach((e: IVisitorDetails) => {
          e.image = e.image ? `${process.env.BASE_URL}${Path.visitor}/${e.added_by_unique_id}/${e.image}` : '';
          e.id_proof_file = e.id_proof_file ? `${process.env.BASE_URL}${Path.visitor_id_proof}/${e.added_by_unique_id}/${e.id_proof_file}` : '';
        })
        return { status_code: 200, data: { success: true, data: visitors, message: ResponseMessages.VISITOR_LIST_FOUND } };
      } else {
        return { status_code: 200, data: { success: false, message: ResponseMessages.VISITOR_LIST_FOUND_NOT } };
      }
    } catch (error: any) {
      return { status_code: 500, data: { success: false, message: ResponseMessages.ERROR_OCCURRE } };
    }
  };
}
export default new visitorServicesData();
