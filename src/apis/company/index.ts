import { instance } from "../axios";
import { ICompanyRegisterRequest, ICheckBuisnessNumberResponse, IMyCompanyResponse } from "./types";

const router = "/companies";

export const checkBusinessNumber = async (business_number: string) => {
  const { data } = await instance.get<ICheckBuisnessNumberResponse>(
    `${router}/exists/${business_number.replace(/-/g, "")}`
  );
  return data;
};

export const companyRegister = async (body: ICompanyRegisterRequest) => {
  const { data } = await instance.post(`${router}`, body);
  return data;
};

export const myCompanyInfo = async () => {
  const { data } = await instance.get<IMyCompanyResponse>(`${router}/my`);
  return data;
};
