import { companyRegister, myCompanyInfo } from "@/apis/company";
import { ICompanyRegisterRequest } from "@/apis/company/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCompanyRegister = (body: ICompanyRegisterRequest) => {
  const router = useRouter();

  return useMutation(() => companyRegister(body), {
    onSuccess: () => {
      alert("성공");
      router.push("/");
    },
  });
};

export const useMyCompanyInfo = () => {
  return useQuery(["myCompany"], () => myCompanyInfo());
};
