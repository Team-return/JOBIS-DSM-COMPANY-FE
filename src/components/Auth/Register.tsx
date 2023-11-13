"use client";

import React, { useEffect } from "react";
import { styled } from "styled-components";
import { CheckBox, DropDown, Stack, theme, useToastStore } from "@team-return/design-system";
import DaumPostcode from "react-daum-postcode";
import { CustomInput, FileInput, Input, TextArea } from "../Input";
import OptionTitle from "../OptionTitle";
import Modal from "../Modal";
import { useInput } from "@/hooks/useInput";
import { useCompanyRegister } from "@/hooks/apis/useCompanyApi";
import { useUpload } from "@/hooks/useUploadFile";
import { ICompanyRegisterRequest } from "@/apis/company/types";
import { useModal } from "@/hooks/useModal";
import { Address } from "react-daum-postcode";
import { useGetCode } from "@/hooks/apis/useCodeApi";
import { regex } from "../../utils/regex";
import { useRouter } from "next/navigation";

export interface IFiles {
  company_profile: File[];
  biz_registration: File[];
  attachment: File[];
}

export default function Register() {
  const { form, setForm, onChange } = useInput<ICompanyRegisterRequest>({
    name: typeof window !== "undefined" ? (sessionStorage.getItem("company_info") as string) : "",
    founded_at: "",
    representative_name: "",
    main_zip_code: "",
    sub_zip_code: undefined,
    main_address: "",
    main_address_detail: "",
    sub_address: undefined,
    sub_address_detail: undefined,
    take: 0,
    worker_number: 0,
    company_introduce: "",
    email: "",
    manager_name: "",
    sub_manager_name: undefined,
    manager_phone_no: "",
    sub_manager_phone_no: undefined,
    fax: undefined,
    password: 1234,
    business_number:
      typeof window !== "undefined" ? (sessionStorage.getItem("company_number")?.replace(/-/g, "") as string) : "",
    company_profile_url: "",
    biz_registration_url: "",
    business_area_code: 0,
    service_name: "",
    attachment_urls: [],
  });

  const {
    name,
    founded_at,
    representative_name,
    main_address,
    main_address_detail,
    sub_zip_code,
    sub_address,
    sub_address_detail,
    take,
    worker_number,
    company_introduce,
    email,
    manager_name,
    sub_manager_name,
    manager_phone_no,
    sub_manager_phone_no,
    fax,
    business_number,
    business_area_code,
    service_name,
    company_profile_url,
  } = form;
  const { append } = useToastStore();

  const { phone_number, date_number, buisness_number } = regex;

  const { data: business_codes } = useGetCode("BUSINESS_AREA");

  const { files, onUploadImage, setFiles } = useUpload<IFiles, ICompanyRegisterRequest>(
    { company_profile: [], biz_registration: [], attachment: [] },
    setForm
  );

  const { closeModal, openModal, modalState } = useModal();

  const { mutate: registerCompany } = useCompanyRegister({
    ...form,
    founded_at: date_number(founded_at),
    fax: date_number(fax ?? "") || undefined,
    manager_phone_no: manager_phone_no?.replace(/-/g, ""),
    sub_zip_code: sub_zip_code || undefined,
    sub_address: sub_address || undefined,
    sub_address_detail: sub_address_detail || undefined,
    sub_manager_name: sub_manager_name || undefined,
    sub_manager_phone_no: sub_manager_phone_no?.replace(/-/g, "") || undefined,
    company_profile_url: company_profile_url || undefined,
  });

  const router = useRouter();

  const selectAddress = (data: Address) => {
    if (modalState === "MAIN_ADDRESS") {
      setForm({
        ...form,
        main_address: data?.address,
        main_zip_code: data?.zonecode,
      });
    } else if (modalState === "SUB_ADDRESS") {
      setForm({
        ...form,
        sub_address: data?.address,
        sub_zip_code: data?.zonecode,
      });
    }
    closeModal();
  };

  const keywords = business_codes?.codes.map((item) => item.keyword) ?? [];

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; //Chrome에서 동작하도록; deprecated
  };

  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("company_info")) {
      router.push("/login");
      append({ message: "사업자 인증을 먼저 완료해주세요", type: "RED" });
    }
  }, []);

  return (
    <Container>
      <Title>기업 정보 등록</Title>
      <SubTitle>
        등록된 정보는 본 시스템을 통해 접수된 건에 한하여 정식적으로 검토되며 <br />
        등록된 정보는 서비스 이용에 활용됩니다.
      </SubTitle>
      <RequireText>
        <BlueStar>*</BlueStar> 표시는 필수 입력 항목입니다.
      </RequireText>
      <OptionTitle title="기업정보" />
      <Input
        onChange={() => {
          console.log("hello");
        }}
        title="기업명"
        value={name}
        required
      />
      <Input
        onChange={() => {
          console.log("hello");
        }}
        title="사업자 번호"
        value={buisness_number(business_number)}
        required
      />
      <Input title="대표자" name="representative_name" value={representative_name} onChange={onChange} required />
      <Input
        title="설립일"
        maxLength={10}
        name="founded_at"
        onChange={onChange}
        value={date_number(founded_at)}
        placeholder="2022-01-01"
        required
      />
      <Input
        disabled
        name="main_address"
        value={main_address}
        onChange={onChange}
        title="주소 (본사)"
        required
        button={<SearchButton onClick={() => openModal("MAIN_ADDRESS")}>검색</SearchButton>}
      />
      <Input
        name="main_address_detail"
        onChange={onChange}
        value={main_address_detail}
        required
        placeholder="상세주소"
      />
      <Input
        disabled
        name="sub_address"
        value={sub_address}
        onChange={onChange}
        title="주소 (지점)"
        button={<SearchButton onClick={() => openModal("SUB_ADDRESS")}>검색</SearchButton>}
      />
      <Input name="sub_address_detail" onChange={onChange} value={sub_address_detail} placeholder="상세주소" />
      <Input name="take" value={take} onChange={onChange} title="매출액" required placeholder="억/년" unit="억/년" />
      <Input
        name="worker_number"
        onChange={onChange}
        value={worker_number}
        title="총 근로자수"
        required
        placeholder="명"
        unit="명"
      />
      <CustomInput title="사업 분야" required>
        <DropDown
          value={String(
            business_codes?.codes.find((code) => code.code === business_area_code)?.keyword ?? "사업분야를 선택해주세요"
          )}
          width={100}
          onChange={(business) =>
            setForm({
              ...form,
              business_area_code: business_codes?.codes.find((code) => code.keyword === business)?.code as number,
            })
          }
          option={keywords}
        />
      </CustomInput>

      <OptionTitle title="담당자" />
      <ManagerGrid>
        <Input name="manager_name" value={manager_name} onChange={onChange} title="담당자명" required />
        <Input
          maxLength={13}
          name="manager_phone_no"
          title="전화번호"
          onChange={onChange}
          value={phone_number(manager_phone_no)}
          required
        />
        <Input name="sub_manager_name" onChange={onChange} value={sub_manager_name} title="담당자명" />
        <Input
          maxLength={13}
          name="sub_manager_phone_no"
          title="전화번호"
          onChange={onChange}
          value={phone_number(sub_manager_phone_no ?? "")}
        />
      </ManagerGrid>
      <Input name="email" title="이메일" onChange={onChange} value={email} required />
      <Input name="fax" title="팩스번호" maxLength={13} value={phone_number(fax ?? "")} onChange={onChange} />

      <OptionTitle title="회사소개" />
      <Input title="대표 서비스명" name="service_name" value={service_name} onChange={onChange} required />
      <TextArea name="company_introduce" title="회사개요" value={company_introduce} onChange={onChange} required />
      <FileInput
        setForm={setForm}
        setFiles={setFiles}
        name="biz_registration"
        files={files.biz_registration}
        onUploadImage={onUploadImage}
        messages={["파일은 최대 10MB를 초과 할 수 없고, 1개만 첨부할 수 있습니다.\n이미지 파일만 업로드 가능합니다."]}
        title="사업자 등록증"
      />
      <FileInput
        setForm={setForm}
        setFiles={setFiles}
        name="company_profile"
        files={files.company_profile}
        onUploadImage={onUploadImage}
        messages={["파일은 최대 10MB를 초과 할 수 없고, 1개만 첨부할 수 있습니다.\n이미지 파일만 업로드 가능합니다."]}
        title="회사 로고"
      />
      <FileInput
        setForm={setForm}
        setFiles={setFiles}
        name="attachment"
        files={files.attachment}
        onUploadImage={onUploadImage}
        multiple
        messages={[
          "홍보영상, 회사 소개서, 회사 사진등과 같은 홍보자료를 첨부하세요",
          "파일은 최대 50MB를 초과 할 수 없습니다. \nPDF, PPT, PPTX, HWP, JPG, PNG, ZIP, TXT, MP4 파일만 가능합니다.",
        ]}
        title="파일 첨부"
      />

      <OptionTitle title="개인정보 수집 및 이용 안내" />
      <iframe
        src="https://jobis-webview.team-return.com/sign-up-policy"
        width="100%"
        height={300}
        style={{ marginBottom: 20, border: `1px solid ${theme.color.gray40}`, borderRadius: 4 }}
      ></iframe>
      <div style={{ width: "100%", marginBottom: 20 }}>
        <CheckBox margin={["right", "auto"]}>개인정보 수집에 동의합니다</CheckBox>
      </div>

      <Stack gap={30}>
        <CancelButton>취소</CancelButton>
        <ConfirmRequestButton onClick={() => registerCompany()}>기업 등록 완료</ConfirmRequestButton>
      </Stack>

      {(modalState === "MAIN_ADDRESS" || modalState === "SUB_ADDRESS") && (
        <Modal width={400} onClose={closeModal}>
          <DaumPostcode onComplete={selectAddress}></DaumPostcode>
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  padding: 85px 105px;
  min-height: 100px;
  border-radius: 30px;
  background-color: white;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25));
  margin-top: 130px;
  z-index: 99;
  overflow: hidden;
`;

const RequireText = styled.div`
  display: flex;
  margin-top: 50px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #7f7f7f;
  font-weight: 400;
`;

const BlueStar = styled.div`
  font-size: 17px;
  color: #0087ff;
  margin-right: 2px;
`;

const Title = styled.div`
  font-size: 35px;
  font-weight: 650;
`;

const SubTitle = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  margin-top: 15px;
`;

const ManagerGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 50px;
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 45px;
  padding: 15px;
  margin-left: 20px;
  border: 1.5px solid #0f4c82;
  border-radius: 3px;
  color: #0f4c82;
  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

const CancelButton = styled.button`
  padding: 12px 40px;
  border-radius: 3px;
  border: 1.5px solid #0f4c82;
  border-radius: 8px;
  color: #0f4c82;
  ${theme.font.Body2};
  cursor: pointer;
`;

const ConfirmRequestButton = styled.button`
  padding: 12px 40px;
  border-radius: 8px;
  background-color: ${theme.color.blue};
  ${theme.font.Body2};
  color: ${theme.color.gray10};
  cursor: pointer;
`;
