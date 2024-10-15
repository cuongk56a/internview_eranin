import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import httpStatus from "http-status";

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    if(userId != req.userId){
      res.status(httpStatus.UNAUTHORIZED).send("Not Have Authorized!");
    }
    const data = await userService.getOne({ _id: req.userId });
    if (!data) {
      res.status(httpStatus.BAD_REQUEST).send("Not found!")
    }
    res.send(data);
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

export const userController = {
  getOne,
};
