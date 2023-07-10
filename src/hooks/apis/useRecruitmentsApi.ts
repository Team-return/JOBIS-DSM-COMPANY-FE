import { createRecruitmentsRequest, myRecruitment } from "@/apis/recruitments";
import { IRecruitment } from "@/apis/recruitments/types";
import { useMutation, useQuery } from "@tanstack/react-query";

/** 모집의뢰 작성 */
export const useCreateRecruitmentRequest = (body: IRecruitment) => {
  return useMutation(() => createRecruitmentsRequest(body), {
    onSuccess: () => alert("성공"),
  });
};

/** 내 모집의뢰서 조회 */
export const useMyRecruitment = () => {
  return useQuery(["myRecruit"], () => myRecruitment());
};
