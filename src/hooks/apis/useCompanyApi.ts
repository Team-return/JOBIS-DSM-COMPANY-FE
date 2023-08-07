import { companyRegister, myCompanyInfo, updateCompanyInfo } from "@/apis/company";
import { ICompanyRegisterRequest, IUpdateCompanyInfoRequest } from "@/apis/company/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCompanyRegister = (body: ICompanyRegisterRequest) => {
  const router = useRouter();

  return useMutation(() => companyRegister(body), {
    onSuccess: () => {
      alert("성공");
      router.push("/login");
    },
  });
};

export const useMyCompanyInfo = () => {
  return useQuery(["myCompany"], () => myCompanyInfo());
};

export const useUpdateCompanyInfo = (body: IUpdateCompanyInfoRequest) => {
  const queryClient = useQueryClient();

  return useMutation(() => updateCompanyInfo(body), {
    onSuccess: () => {
      alert("성공");
      queryClient.invalidateQueries(["myCompany"]);
    },
  });
};
