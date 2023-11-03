import { createRecruitmentsRequest, myRecruitment, updateRecruitArea, updateRecruitment } from "@/apis/recruitments";
import { IArea, IEditRecruitmentRequest, IRecruitment } from "@/apis/recruitments/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@team-return/design-system";
import { useRouter } from "next/navigation";

/** 모집의뢰 작성 */
export const useCreateRecruitmentRequest = (body: IRecruitment) => {
  const router = useRouter();
  const { append } = useToastStore();

  return useMutation(() => createRecruitmentsRequest(body), {
    onSuccess: () => {
      append({
        type: "GREEN",
        message: "모집의뢰서 작성에 성공하였습니다",
      });
      router.push("/");
    },
    onError: () => {
      append({
        type: "RED",
        message: "모집의뢰서 작성에 실패하였습니다",
      });
    },
  });
};

/** 내 모집의뢰서 조회 */
export const useMyRecruitment = () => {
  return useQuery(["myRecruit"], () => myRecruitment());
};

export const useUpdateRecruitment = (body: IEditRecruitmentRequest) => {
  const queryClient = useQueryClient();
  const { append } = useToastStore();

  return useMutation((id: number) => updateRecruitment(body, id), {
    onSuccess: () => {
      append({
        type: "GREEN",
        message: "수정이 완료되었습니다",
      });
      queryClient.invalidateQueries(["myRecruit"]);
    },
  });
};

export const useUpdateRecruitArea = (body: IArea) => {
  const queryClient = useQueryClient();
  const { append } = useToastStore();

  return useMutation((id: number) => updateRecruitArea(body, id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["myRecruit"]);
    },
    onError: () => {
      append({
        type: "RED",
        message: "수정에 실패하였습니다",
      });
    },
  });
};
