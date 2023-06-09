import { login } from "@/apis/users";
import { ILoginRequest } from "@/apis/users/types";
import { useMutation } from "@tanstack/react-query";
import cookie from "react-cookies";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useLogin = (body: ILoginRequest) => {
  const router = useRouter();

  return useMutation(() => login(body), {
    onSuccess: (res) => {
      const { access_token, access_expires_at, refresh_expires_at, refresh_token, authority } = res;
      const accessTokenExpire = new Date(access_expires_at);
      const refresTokenExpire = new Date(refresh_expires_at);
      cookie.save("access_token", access_token, { expires: accessTokenExpire, path: "/" });
      cookie.save("refresh_token", refresh_token, { expires: refresTokenExpire, path: "/" });
      localStorage.setItem("authority", authority);
      alert("성공");
      router.push("/");
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        alert("비밀번호가 일치하지 않습니다");
        cookie.remove("access_token");
        cookie.remove("refresh_token");
      }
    },
  });
};
