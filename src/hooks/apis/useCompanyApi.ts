import { companyRegister, myCompanyInfo, updateCompanyInfo } from "@/apis/company";
import { ICompanyRegisterRequest, IUpdateCompanyInfoRequest } from "@/apis/company/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@team-return/design-system";
import { useRouter } from "next/navigation";

export const useCompanyRegister = (body: ICompanyRegisterRequest) => {
  const router = useRouter();
  const { append } = useToastStore();

  return useMutation(() => companyRegister(body), {
    onSuccess: () => {
      router.push("/login");
      append({
        type: "GREEN",
        message: "가입에 성공하였습니다",
      });
    },
    onError: () => {
      append({
        type: "RED",
        message: "가입에 실패하였습니다",
      });
    },
  });
};

export const useMyCompanyInfo = () => {
  return useQuery(["myCompany"], () => myCompanyInfo());
};

export const useUpdateCompanyInfo = (body: IUpdateCompanyInfoRequest) => {
  const queryClient = useQueryClient();
  const { append } = useToastStore();
  const router = useRouter();

  return useMutation((company_id: number) => updateCompanyInfo(body, company_id), {
    onSuccess: () => {
      append({ type: "GREEN", message: "기업 정보 수정이 완료 되었습니다." });
      queryClient.invalidateQueries(["myCompany"]);
      router.push("/mypage");
    },
    onError: () => {
      append({ type: "RED", message: "기업 정보 수정에 실패하였습니다." });
    },
  });
};
