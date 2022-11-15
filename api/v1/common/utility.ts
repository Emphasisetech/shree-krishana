
import { NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs"
import { Employee } from "../models/employee";
import TimeConst from "./constants/time";
import role from "./constants/role";
import { connection } from "../../../connection/connection";
import _ from "lodash";
import mime from "mime";
import common from "./constants/common";

dotenv.config();
const secret_key = process.env.SECRET_KEY || '';

export class Validation {
  data: any;
  error: any[];
}

class Utility {
  validateAndConvert = async (validateData: any, body: any) => {
    const result = new Validation();
    result.data = plainToInstance(validateData, body);
    await validate(result.data, { skipMissingProperties: true }).then(
      (errors) => {
        if (errors.length > 0) {
          result.error = _.compact(errors.map((err) => err.constraints));

          return result;
        }
      }
    );
    return result;
  };

  signJWT = (payload: any, expires_in?: string): string => {
    let jwtToken = jwt.sign(payload, secret_key, {
      expiresIn: expires_in ?? TimeConst.DEFAULT_EXP_TIME,
    });
    return jwtToken;
  };

  authenticateUser = async (req: any, res: any, next: NextFunction) => {
    try {
      const auth_header: string = req.headers.authorization;
      if (auth_header) {
        jwt.verify(auth_header, secret_key, async (err: any, user: any) => {
          try {
            if (user.exp > Date.now()) {
              console.log(user.exp - Date.now());
              if (req.baseUrl == '/api/v1/auth/logOut') {
                return res.status(200).json({ status: true, msg: 'logout successfully' });
              } else {
                return res.status(401).json({ status: false, msg: "Token expired" });
              }
            } else if (user && user.id) {

              let result: any
              await connection.then(async connection => {
                result = await connection.manager.findOne(Employee, { id: user.id });
                // console.log(result);
              }).catch(error => {
                console.error("Error ", error);
                return;
              });
              if (result && result.username && result.username === user.username) {
                req.user = user;
                result.password = '';
                req.userDetail = result;
                next();
              } else {
                return res.status(401).json({ status: false, error: "Unauthorized access.", });
              }
            } else {
              return res.status(401).json({ status: false, error: "Unauthorized access.", });
            }
          } catch (error) {
            return res.status(401).json({ status: false, msg: "Token expired" });
          }
        });
      } else {
        return res.status(401).json({ status: false, error: "Authentication header required", });
      }
    } catch (error) {
      return res.status(500).json({ status: false, error: "Internal Server Error", });
    }
  }

  authenticateAdmin = async (req: any, res: any, next: NextFunction) => {
    try {
      const auth_header: string = req.headers.authorization;
      if (auth_header) {
        jwt.verify(auth_header, secret_key, async (err: any, user: any) => {
          if (user && user.exp > Date.now()) {
            return res.status(401).json({ status: false, msg: "Token expired" });
          } else if (user && user.id) {
            let result: any
            await connection.then(async connection => {
              result = await connection.manager.findOne(Employee, { id: user.id, role: role.ADMIN });
            }).catch(error => {
              console.error("Error ", error);
              return;
            });
            if (result && result.username && result.username === user.username) {
              req.user = user;
              result.password = '';
              req.userDetail = result;
              next();
            } else {
              return res.status(401).json({ status: false, error: "Unauthorized access.", });
            }
          } else {
            return res.status(401).json({ status: false, error: "Unauthorized access.", });
          }
        });
      } else {
        return res.status(401).json({ status: false, error: "Authentication header required", });
      }
    } catch (error) {
      return res.status(500).json({ status: false, error: "Internal Server Error", });
    }
  }

  saveFile = (imageFile: any, imagestorage: string, name: any) => {
    if (!fs.existsSync(imagestorage)) {
      fs.mkdirSync(imagestorage, { recursive: true });
    }
    imageFile.mv(`${imagestorage}/${name}`, function (error: any) {
      if (error) {
        return false
      }
    })
    return true
  }

  ConvertBase64ToFile = (data: string, save_file_at: string, file_name: string) => {
    try {
      if (!fs.existsSync(save_file_at)) {
        fs.mkdirSync(save_file_at, { recursive: true });
      }

      if (data) {
  
        let regex = common.base64ToFileExt;
        let matches = data.match(regex) ?? "";
        let ext: string =  matches[1];
        let base64StringBuffer = matches[2];
        let buffer = Buffer.from(base64StringBuffer, "base64");
        fs.writeFileSync(`${save_file_at}/${file_name}.` + ext, buffer);
        return {
          path: `${save_file_at}/${file_name}.${ext}`,
          name: `${file_name}.${ext}`,
        };
      } else
        return {
          path: ``,
          name: ``,
        };
    } catch (err) {
      console.log(err)
      return {
        path: ``,
        name: ``,
      };
    }
  };
}

export default new Utility();