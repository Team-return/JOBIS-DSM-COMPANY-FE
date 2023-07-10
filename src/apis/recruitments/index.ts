import { instance } from "../axios";
import { IMyRecruitmentResponse, IRecruitment } from "./types";

const router = "/recruitments";

export const createRecruitmentsRequest = async (body: IRecruitment) => {
  const { data } = await instance.post<IRecruitment>(`${router}`, body);
  return data;
};

export const myRecruitment = async () => {
  const { data } = await instance.get<IMyRecruitmentResponse>(`${router}/my`);
  return data;
};
