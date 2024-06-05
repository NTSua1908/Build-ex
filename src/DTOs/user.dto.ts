export type UserInfo = {
  email: string;
};

export type UserUpdate = {
  loginEmail: string;
  oneOldPassword: string;
  oneNewPassword: string;
  oneConfirmPassword: string;
  secondOldPassword: string;
  secondNewPassword: string;
  secondConfirmPassword: string;
  thirdOldPassword: string;
  thirdNewPassword: string;
  thirdConfirmPassword: string;
};
