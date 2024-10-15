import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import {userService} from '../user/user.service';
import {appConfigs} from '../../config/config';
import {checkPassword, hashPassword} from '../../utils/password';
import {getNewRefreshToken, getNewToken} from '../../config/passport';
import {IUserDoc} from '../user/user.type';
import {UserModel} from '../user/user.model';
import { getRefresh, setRefresh } from '../../redis/redisRefreshToken';
import { getRedisCode } from '../../redis/redisCode';
import { pick } from '../../utils/pick';
import nodemailer from 'nodemailer';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password, confirmPassword, fullName} = req.body;
  try {
    const user: IUserDoc | null = await userService.getOne({
      email: email
    });
    if (!!user) {
      res.status(httpStatus.BAD_REQUEST).send({message: 'Email đã được sử dụng!'});
    }  if (password !== confirmPassword) {
      res.status(httpStatus.BAD_REQUEST).send({message: 'Mật khẩu và mật khẩu xác nhận không trùng nhau!'});
    } else{
      const hashedPassword = await hashPassword(password);
      const data: IUserDoc | null = await userService.createOne({
        fullName,
        email,
        hashedPassword,
      });
      if (!data) {
        throw new Error('Not Found');
      }
      res.send({message: 'Đăng ký thành công!'});
    }
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password, code} = req.body;
  try {
    const [fCode, user]= await Promise.all([getRedisCode(email), userService.getOne({email})]);
    if (!user) {
      res.status(httpStatus.NOT_FOUND).send({message: 'Not Found User!'});
    } else if(!code || fCode != code){
      res.status(httpStatus.BAD_REQUEST).send({message: 'Code Not Success!'});
    } else {
      const check = await checkPassword(password, user?.hashedPassword);
      if (check) {
        const token = await getNewToken({userId: user.id});
        const refresh = await getNewRefreshToken({userId: user.id});
        await setRefresh(refresh, user.id)
        res.send({ message: 'Đăng nhập thành công!',userId: user.id, accessToken: token, refreshToken: refresh});
      } else {
        res.status(httpStatus.BAD_REQUEST).send({message: 'Email Or Password Not Incorrect!'});
      }
    }
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const {refreshToken} = req.body;
  try {
    const userId = await getRefresh(refreshToken)
    if(userId){
      const newToken = await getNewToken({userId: userId})
      res.send({accessToken: newToken})
    }else{
      res.status(httpStatus.NOT_FOUND).send('Invalid request')
    }
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

const sendMail = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = pick(req.query, ['email']);
  try {
    const confirmCode = await getRedisCode(email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: appConfigs.google.email,
        pass: appConfigs.google.pass,
      },
    });
    const received = {
      from: appConfigs.google.email,
      to: email,
      subject: 'Mã Xác Thực',
      html: `<p>- Chào mừng bạn đã đến với hệ thống.</p><p>- Mã xác nhận của bạn: <span style="font-weight: bold">${confirmCode}</span></p><p>- Mã xác thực chỉ tồn tại trong vòng 1 phút!</p>`,
    };
    await transporter.sendMail(received, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Send Email Success! ' + info.response);
        res.send('Send Email Success!');
      }
    });
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

export const authController = {
  register,
  login,
  refreshToken,
  sendMail
};
