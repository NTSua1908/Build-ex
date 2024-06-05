import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { UserInfo, UserUpdate } from "../DTOs/user.dto";
import { JSONBodyRequest } from "../request";

class UserController {
  async GetUserInfo(req: Request, res: Response) {
    const id = (req as any).userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User can not be found" });
    }
    const userInfo: UserInfo = {
      email: user.email,
    };
    return res.status(200).json(userInfo);
  }

  async UpdateUser(req: JSONBodyRequest<UserUpdate>, res: Response) {
    const id = (req as any).userId;
    const user = await User.findById(id);
    console.log(id);

    if (!user) {
      return res.status(400).json({ message: "User can not be found" });
    }

    const userInfo = req.body;

    const errors = validateUpdate(userInfo);
    if (errors.length != 0) {
      return res.status(400).json({
        message: errors.join("\n"),
      });
    }

    try {
      if (userInfo.oneNewPassword.length != 0) {
        const isCorrect = bcrypt.compareSync(
          userInfo.oneOldPassword,
          user.password
        );
        console.log(isCorrect, userInfo.oneOldPassword);

        if (isCorrect)
          user.password = bcrypt.hashSync(userInfo.oneNewPassword, 10);
        else return res.status(400).json({ message: "Password is incorrect" });
      }
      if (userInfo.secondNewPassword.length != 0) {
        const isCorrect = bcrypt.compareSync(
          userInfo.secondNewPassword,
          user.secondPassword
        );
        if (isCorrect)
          user.secondPassword = bcrypt.hashSync(userInfo.secondNewPassword, 10);
        else return res.status(400).json({ message: "Password is incorrect" });
      }
      if (userInfo.thirdNewPassword.length != 0) {
        const isCorrect = bcrypt.compareSync(
          userInfo.thirdNewPassword,
          user.thirdPassword
        );
        if (isCorrect)
          user.thirdPassword = bcrypt.hashSync(userInfo.thirdNewPassword, 10);
        else return res.status(400).json({ message: "Password is incorrect" });
      }

      await user.save();
      return res.status(200).json();
    } catch {
      return res.status(400).json({ message: "Password incorrect!!!" });
    }
  }
}

export default new UserController();

const validateUpdate = (userInfo: UserUpdate) => {
  let errors1 = validatePassword(
    userInfo.oneOldPassword,
    userInfo.oneNewPassword,
    userInfo.oneConfirmPassword
  );
  let errors2 = validatePassword(
    userInfo.secondOldPassword,
    userInfo.secondNewPassword,
    userInfo.secondConfirmPassword
  );
  let errors3 = validatePassword(
    userInfo.thirdOldPassword,
    userInfo.thirdNewPassword,
    userInfo.thirdConfirmPassword
  );

  const errors = [
    errors1.length != 0 ? "Mật khẩu cấp 1: " + errors1.join("; ") : "",
    errors2.length != 0 ? "Mật khẩu cấp 2: " + errors2.join("; ") : "",
    errors3.length != 0 ? "Mật khẩu cấp 3: " + errors3.join("; ") : "",
  ].filter((error) => error.length != 0);

  return errors;
};

const validatePassword = (
  oneOldPassword: string,
  oneNewPassword: string,
  oneConfirmPassword: string
): string[] => {
  let errors: string[] = [];
  if (oneNewPassword.length != 0 || oneConfirmPassword.length != 0) {
    if (oneOldPassword.length == 0) {
      errors.push("mật khẩu cũ là bắt buộc");
    }
    if (oneConfirmPassword != oneNewPassword) {
      errors.push("nhập lại mật khẩu không khớp");
    }
    if (oneNewPassword.length < 6) {
      errors.push("mật khẩu cần ít nhất có 6 kí tự");
    }
  }

  return errors;
};
