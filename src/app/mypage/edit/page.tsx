"use client";

import { useMyCompanyInfo, useUpdateCompanyInfo } from "@/hooks/apis/useCompanyApi";
import { HStack, Stack, Text, VStack, theme } from "@team-return/design-system";
import Image from "next/image";
import { styled } from "styled-components";
import { Spinner } from "@/components/Spinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/hooks/useInput";
import { IUpdateCompanyInfoRequest } from "@/apis/company/types";
import DaumPostcode, { Address } from "react-daum-postcode";
import Modal from "@/components/Modal";
import { useModalStateStore } from "@/store/modalStore";
import { useModal } from "@/hooks/useModal";

const companyType = {
  LEAD: "선도기업",
  PARTICIPATING: "참여기업",
  "": "",
};

export default function EditMyPage() {
  const { data: myCompany, isLoading } = useMyCompanyInfo();
  const router = useRouter();
  const { modalState } = useModalStateStore();
  const { closeModal, openModal } = useModal();

  const { form, setForm, onChange } = useInput<IUpdateCompanyInfoRequest>({
    founded_at: "",
    representative_name: "",
    main_zip_code: "",
    sub_zip_code: undefined,
    main_address: "",
    main_address_detail: undefined,
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
    company_profile_url: undefined,
    service_name: "",
  });
  const { mutateAsync } = useUpdateCompanyInfo({
    ...form,
    fax: form.fax || undefined,
    sub_zip_code: form.sub_zip_code || undefined,
  });

  useEffect(() => {
    if (myCompany) {
      setForm({
        founded_at: myCompany.founded_at,
        representative_name: myCompany.representative,
        main_zip_code: myCompany.main_zip_code,
        sub_zip_code: myCompany.sub_zip_code,
        main_address: myCompany.main_address,
        main_address_detail: myCompany.main_address_detail,
        sub_address: myCompany.sub_address,
        sub_address_detail: myCompany.sub_address_detail,
        take: myCompany.take,
        worker_number: myCompany.workers_count,
        company_introduce: myCompany.company_introduce,
        email: myCompany.email,
        manager_name: myCompany.manager_name,
        sub_manager_name: myCompany.sub_manager_name,
        manager_phone_no: myCompany.manager_phone_no,
        sub_manager_phone_no: myCompany.sub_manager_phone_no,
        fax: myCompany.fax,
        company_profile_url: myCompany.company_logo_url,
        service_name: myCompany.service_name,
      });
    }
  }, [myCompany, setForm]);

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

  if (isLoading)
    return (
      <LoadingContainer>
        <Spinner position="center" size={50} />
      </LoadingContainer>
    );

  return (
    <Container>
      <HStack gap={30}>
        <Logo
          width={80}
          height={80}
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${myCompany?.company_logo_url || ""}`}
          alt="로고"
        />
        <VStack>
          <HStack align="center" gap={20}>
            <Text color="gray90" size="Heading3">
              {myCompany?.name}
            </Text>
            <CompanyType color={myCompany?.type}>
              {companyType[myCompany?.type as "LEAD" | "PARTICIPATING"]}
            </CompanyType>
          </HStack>
          <Text color="gray60" size="Body2">
            {myCompany?.main_address}
          </Text>
        </VStack>
        <MenuWrapper>
          <HStack gap={14}>
            <CancelButton onClick={() => router.push("/mypage")}>취소</CancelButton>
            <SaveButton
              onClick={async () => {
                await mutateAsync(myCompany!.company_id);
                router.push("/mypage");
              }}
            >
              저장
            </SaveButton>
          </HStack>
        </MenuWrapper>
      </HStack>
      <Line />
      <VStack gap={30}>
        <HStack>
          <Stack width={940}>
            <Title>대표 서비스명</Title>
            <Input name="service_name" onChange={onChange} value={form?.service_name} />
          </Stack>
        </HStack>
        <HStack>
          <Stack width={940}>
            <Title>회사소개</Title>
            <TextArea name="company_introduce" onChange={onChange} value={form.company_introduce} />
          </Stack>
        </HStack>
        <HStack>
          <Title>본사주소</Title>
          <VStack width={940} gap={16}>
            <HStack gap={20}>
              <Input name="main_address" value={form?.main_address} />
              <AddressButton onClick={() => openModal("MAIN_ADDRESS")}>주소 검색</AddressButton>
            </HStack>
            <Input name="main_address_detail" onChange={onChange} value={form.main_address_detail} />
          </VStack>
        </HStack>
        <HStack>
          <Title>지점 주소</Title>
          <VStack width={940} gap={16}>
            <HStack gap={20}>
              <Input name="sub_address" value={form.sub_address} />
              <AddressButton onClick={() => openModal("SUB_ADDRESS")}>주소 검색</AddressButton>
            </HStack>
            <Input name="sub_address_detail" onChange={onChange} value={form.sub_address_detail} />
          </VStack>
        </HStack>
        <Grid>
          <VStack gap={30}>
            <HStack>
              <Title>대표</Title>
              <Input name="representative_name" value={form.representative_name} />
            </HStack>
            <HStack>
              <Title>설립일</Title>
              <Input name="founded_at" type="date" value={form.founded_at} />
            </HStack>
            <HStack>
              <Title>담당자1</Title>
              <Input name="manager_name" onChange={onChange} value={form.manager_name} />
            </HStack>
            <HStack>
              <Title>담당자2</Title>
              <Input name="sub_manager_name" onChange={onChange} value={form.sub_manager_name} />
            </HStack>
            <HStack>
              <Title>이메일</Title>
              <Input name="email" onChange={onChange} value={form.email} />
            </HStack>
          </VStack>
          <VStack gap={30}>
            <HStack>
              <Title>사업자번호</Title>
              <Input value={myCompany?.biz_no} />
            </HStack>
            <HStack>
              <Title>근로자 수</Title>
              <Input name="worker_number" onChange={onChange} value={form.worker_number} />
            </HStack>
            <HStack>
              <Title>전화번호1</Title>
              <Input name="manager_phone_no" onChange={onChange} value={form.manager_phone_no} />
            </HStack>
            <HStack>
              <Title>전화번호2</Title>
              <Input name="sub_manager_phone_no" onChange={onChange} value={form.sub_manager_phone_no} />
            </HStack>
            <HStack>
              <Title>팩스</Title>
              <Input name="fax" onChange={onChange} value={form.fax} />
            </HStack>
          </VStack>
        </Grid>
      </VStack>

      {(modalState === "MAIN_ADDRESS" || modalState === "SUB_ADDRESS") && (
        <Modal width={400} onClose={closeModal}>
          <DaumPostcode onComplete={selectAddress} />
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 940px;
  min-height: 0px;
  margin: 0 auto;
  margin-top: 50px;
  padding-bottom: 100px;
`;

const Logo = styled(Image)`
  border: 1px solid ${theme.color.gray40};
`;

const CompanyType = styled.div<{ color?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  border-radius: 100px;
  padding: 5px 12px;
  font-weight: 400;
  font-size: 12px;
  ${({ color }) => {
    switch (color) {
      case "PARTICIPATING":
        return `
        color: ${theme.color.success};
        background-color: rgba(46, 204, 113, 0.1);
        border: 1px solid ${theme.color.success};
        `;
      case "LEAD":
        return `
        color: ${theme.color.skyblue};
        background-color: rgba(35, 123, 201, 0.1);
        border: 1px solid ${theme.color.skyblue};
        `;
    }
  }}
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.color.gray50};
  margin: 40px 0;
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 120px;
  height: 45px;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.color.liteBlue};
  white-space: nowrap;
  margin-right: 20px;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
`;

const LoadingContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 200px);
`;

const MenuWrapper = styled.div`
  position: relative;
  cursor: pointer;
  margin: auto 0 auto auto;
  height: 80px;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ disabled?: boolean }>`
  width: 100%;
  height: 45px;
  padding: 10px 15px;
  border: 0;
  outline: 0;
  margin-left: auto;
  border: 1px solid #cccccc;
  border-radius: 2px;
  font-size: 18px;
  font-weight: 400;
  &::placeholder {
    color: #7f7f7f;
  }
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "auto")};
`;

const AddressButton = styled.button`
  all: unset;
  height: 45px;
  padding: 0 30px;
  border-radius: 3px;
  border: 1px solid ${theme.color.liteBlue};
  color: ${theme.color.liteBlue};
  font-size: 18px;
  font-weight: 400;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background-color: ${theme.color.gray40};
  }
  &:active {
    background-color: ${theme.color.liteBlue};
    color: ${theme.color.gray10};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  border: 0;
  outline: 0;
  border: 1px solid #cccccc;
  border-radius: 2px;
  resize: none;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 15px;
  &::placeholder {
    color: #7f7f7f;
  }
`;

const SaveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${theme.color.liteBlue};
  padding: 20px;
  height: 40px;
  width: auto;
  font-size: 18px;
  font-weight: 400;
  color: ${theme.color.gray10};
`;

const CancelButton = styled(SaveButton)`
  color: ${theme.color.gray60};
  background-color: ${theme.color.gray10};
  border: 1px solid ${theme.color.gray50};
`;
