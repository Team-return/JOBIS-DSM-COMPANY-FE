"use client";

import Image from "next/image";
import styled from "styled-components";
import CompanyImg from "../../../public/SignUpImg.png";
import InfoIcon from "../../../public/INFO.png";
import { useInput } from "../../hooks/useInput";
import { theme } from "@team-return/design-system";
import { checkBusinessNumber } from "@/apis/company";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/apis/useLoginApi";
import { regex } from "../../utils/regex";
import cookie from "react-cookies";
import { useToastStore } from "@team-return/design-system";
import { Spinner } from "../Spinner";

export default function SignIn() {
  const router = useRouter();
  const { form, onChange, setForm } = useInput({ id: "", pw: "", isNext: false, isExist: false });
  const { id, pw, isNext, isExist } = form;
  const [hover, setHover] = useState(true);
  const { append } = useToastStore();

  const CheckCompany = useMutation(() => checkBusinessNumber(id), {
    onSuccess: (res) => {
      const { exists, company_name } = res;
      sessionStorage.setItem("company_number", id);
      sessionStorage.setItem("company_info", company_name);
      setForm((prev) => ({ ...prev, isNext: true }));
      if (exists) {
        setForm((prev) => ({ ...prev, isExist: true }));
      } else {
        setForm((prev) => ({ ...prev, isExist: false }));
      }
    },
    onError: (err: AxiosError) => {
      if (err?.request.status == 401) {
        cookie.remove("access_token");
      }
      if (err?.request.status === 404) {
        append({ type: "RED", message: "존재하지 않는 기업입니다." });
      }
    },
  });

  const { mutate: login, isLoading } = useLogin({ account_id: id.replace(/-/g, ""), password: pw });

  const Auth = () => {
    if (isNext) {
      if (isExist) {
        login();
      } else {
        router.push("/registration");
        sessionStorage.setItem("p", pw);
      }
    } else {
      CheckCompany.mutate();
    }
  };

  const hoverInfo = () => {
    if (isNext) return "* 사업자 번호를 입력후 확인하기를 눌러 기업 존재 여부를 확인해 주세요.";
    else return "* 신규 등록 시 비밀번호를 입력해 주세요. 기존에 등록한 경우, 등록한 비밀번호를 입력해 주세요";
  };

  useEffect(() => {
    setTimeout(() => {
      setHover(false);
    }, 5000);
  }, []);

  return (
    <Container
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Wrapper>
        <Title>사업자 인증</Title>
        {isNext ? (
          <Input
            name="pw"
            value={pw}
            onChange={onChange}
            maxLength={4}
            placeholder="비밀번호를 입력해주세요"
            autoComplete="off"
          />
        ) : (
          <Input
            name="id"
            value={regex.buisness_number(id)}
            placeholder="사업자 번호를 입력해주세요"
            maxLength={12}
            onChange={onChange}
            autoComplete="off"
          />
        )}
        <InfoImg
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          width={20}
          height={20}
          src={InfoIcon}
          alt="image"
          unoptimized
        />
        {hover && <InfoText>{hoverInfo()}</InfoText>}
        <Button type="submit" onClick={Auth} disabled={isLoading || CheckCompany.isLoading}>
          {isLoading || CheckCompany.isLoading ? (
            <Spinner size={16} />
          ) : isNext ? (
            isExist ? (
              "로그인하기"
            ) : (
              "등록하기"
            )
          ) : (
            "사업자 번호 확인"
          )}
        </Button>
      </Wrapper>
      <Img src={CompanyImg} width={550} height={450} alt="company" />
    </Container>
  );
}

const Container = styled.form`
  position: relative;
  width: 850px;
  height: 380px;
  border-radius: 30px;
  background-color: white;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25));
  z-index: 99;
  overflow: hidden;
`;

const Img = styled(Image)`
  position: absolute;
  right: 0;
`;

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  background-color: #ffffff;
`;

const Title = styled.div`
  margin-top: 65px;
  margin-bottom: 40px;
  font-size: 30px;
  font-weight: 400;
`;

const Input = styled.input<{ borderColor?: string }>`
  border: 0;
  outline: 0;
  padding: 10px;
  width: 230px;
  height: 40px;
  border-bottom: 2px solid ${(props) => props.borderColor};
  margin-bottom: 20px;
  font-size: 14px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 350;
  width: 250px;
  height: 40px;
  border-radius: 5px;
  color: white;
  background-color: ${theme.color.blue};
  margin-top: 80px;
  border: 0;
  cursor: pointer;
  &:disabled {
    background-color: ${theme.color.gray50};
    color: ${theme.color.gray10};
    cursor: not-allowed;
  }
`;

const InfoImg = styled(Image)`
  margin-left: 210px;
`;

const InfoText = styled.div`
  position: absolute;
  top: 225px;
  width: 230px;
  padding: 12px 15px;
  border-radius: 10px 0px 10px 10px;
  background: #fafafa;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  font-size: 12px;
`;
