"use client";

import styled from "styled-components";
import React, { useEffect } from "react";
import OptionTitle from "@/components/OptionTitle";
import { CheckBox, HStack, Icon, Stack, VStack, theme } from "@team-return/design-system";
import { CustomInput, Input, TextArea } from "@/components/Input";
import { useInput } from "@/hooks/useInput";
import Image from "next/image";
import { useCreateRecruitmentRequest } from "@/hooks/apis/useRecruitmentsApi";
import Modal from "@/components/Modal";
import ProgressModal from "@/components/Modal/progressModal";
import { IRecruitment } from "@/apis/recruitments/types";
import { useModal } from "@/hooks/useModal";
import { useHiringProgressStore } from "@/store/progressState";
import GatherModal from "@/components/Modal/recruitmentModal";
import { useGetCode } from "@/hooks/apis/useCodeApi";
import TechModal from "@/components/Modal/techModal";
import { hiringProgressType } from "@/utils/translate";
import LicenseModal from "@/components/Modal/licenseModal";
import XBtn from "../../../public/X.svg";
import { useRouter } from "next/navigation";
import { useAreaState } from "@/store/areasState";

export default function Registration() {
  const date = new Date();
  const { hiringProgress } = useHiringProgressStore();

  const { form, onChange, setForm } = useInput<IRecruitment>({
    areas: [],
    required_licenses: [],
    required_grade: "",
    start_time: "",
    end_time: "",
    train_pay: "",
    pay: "",
    benefits: "",
    military: false,
    hiring_progress: ["DOCUMENT"],
    submit_document: "자기소개서, 이력서, 포트폴리오",
    start_date: "",
    end_date: "",
    etc: "",
  });

  const {
    areas,
    required_grade,
    required_licenses,
    start_time,
    end_time,
    train_pay,
    pay,
    benefits,
    military,
    submit_document,
    start_date,
    end_date,
    hiring_progress,
    etc,
  } = form;

  const createRecruitmentRequest = useCreateRecruitmentRequest(form);

  const { modalState, closeModal, openModal } = useModal();
  const { resetArea } = useAreaState();

  const { data: tech_name } = useGetCode("TECH");
  const { data: job_name } = useGetCode("JOB");

  const router = useRouter();

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

  return (
    <Container>
      <RecruimentWrapper>
        <Title>모집의뢰서 등록</Title>
        <SubTitle>
          등록된 정보는 본 시스템을 통해 접수된 건에 한하여 <br />
          정식적으로 검토되며 등록된 정보는 서비스 이용에 활용됩니다.
        </SubTitle>
        <RequireText>
          <BlueStar>*</BlueStar> 표시는 필수 입력 항목입니다.
        </RequireText>

        <OptionTitle title="모집년도" />
        <Input required onChange={() => {}} title="모집년도" value={`${date.getFullYear()}년도`} />

        <OptionTitle title="모집 분야" />
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {!!areas.length && (
            <Boxs>
              {areas.map((area, idx) => {
                const { job_codes, tech_codes, hiring, major_task, preferential_treatment } = area;
                return (
                  <GatherFieldBox key={idx}>
                    <FieldBoxTitle>
                      분야:{" "}
                      {job_name?.codes
                        .filter((code) => job_codes.includes(code?.code))
                        .map((code) => code.keyword)
                        .join(" / ")}
                    </FieldBoxTitle>
                    <FieldText>
                      사용기술 :{" "}
                      {tech_name?.codes.map((code) => tech_codes.includes(code?.code) && code?.keyword + " ") || "없음"}
                    </FieldText>
                    <FieldText style={{ top: 70 }}>주요 업무 : {major_task || "없음"}</FieldText>
                    <FieldText style={{ top: 70 }}>우대사항 : {preferential_treatment || "없음"}</FieldText>
                    <PeopleCount>{hiring}명</PeopleCount>
                    <CancelIcon
                      width={10}
                      height={10}
                      onClick={() => setForm({ ...form, areas: areas.filter((_, idx2) => idx2 !== idx) })}
                      src={XBtn}
                      alt=""
                    />
                  </GatherFieldBox>
                );
              })}
            </Boxs>
          )}
          <BoxContainer onClick={() => openModal("GATHER_FIELD")}>
            <Wrapper>
              <Icon icon="Plus" size={24} color="gray60" />
              <HStack>
                <Text>추가</Text>
                <BlueStar>*</BlueStar>
              </HStack>
            </Wrapper>
          </BoxContainer>
        </div>

        <OptionTitle title="자격요건" />
        <CustomInput title="필수사항">
          <VStack margin={["top", 20]}>
            <Label>
              <CheckBox checked={required_licenses.length >= 1} disabled={!(required_licenses.length >= 1)}>
                국가자격증
              </CheckBox>
            </Label>
            <Licenses>
              {required_licenses.map((license, idx) => (
                <LicenseButton key={idx}>
                  {license}
                  <XText
                    onClick={() => {
                      setForm({ ...form, required_licenses: required_licenses.filter((_, idx2) => idx2 !== idx) });
                    }}
                  >
                    x
                  </XText>
                </LicenseButton>
              ))}
              <AddLicenseButton onClick={() => openModal("LICENSE")}>+ 추가</AddLicenseButton>
            </Licenses>
            <Label>
              <CheckBox checked={!!required_grade} disabled={!required_grade}>
                성적
              </CheckBox>
            </Label>
            <Wrapper>
              <GradeInput
                name="required_grade"
                value={form.required_grade}
                onChange={onChange}
                min={0}
                max={100}
                maxLength={3}
                autoComplete="off"
              />
              <Percent>% 이내</Percent>
            </Wrapper>
          </VStack>
        </CustomInput>

        <OptionTitle title="근무조건" />
        <CustomInput title="근무시간">
          <DateContainer>
            <DateInput
              $width={110}
              name="start_time"
              onChange={onChange}
              value={start_time}
              type="time"
              data-placeholder="출근 시간"
            />
            <Text>~</Text>
            <DateInput
              $width={110}
              name="end_time"
              onChange={onChange}
              value={end_time}
              type="time"
              data-placeholder="퇴근 시간"
              aria-required="true"
            />
          </DateContainer>
        </CustomInput>
        <Input
          name="train_pay"
          value={train_pay}
          required
          onChange={onChange}
          title="실습수당"
          placeholder="만원/월"
          unit="만원/월"
          autoComplete="off"
        />
        <Input
          name="pay"
          value={pay}
          onChange={onChange}
          title="정규직 전환시"
          placeholder="만원/년"
          unit="만원/년"
          autoComplete="off"
        />
        <TextArea name="benefits" value={benefits} onChange={onChange} title="복리후생" />
        <CustomInput>
          <CheckBox
            name="military"
            checked={military}
            type="checkbox"
            onChange={() => setForm({ ...form, military: !military })}
          >
            병역특례 신청
          </CheckBox>
        </CustomInput>

        <OptionTitle title="채용 절차" />
        <CustomInput title="채용 절차" required>
          <AddRecruitmentButton onClick={() => openModal("HIRING_PROGRESS")}>절차 추가하기 +</AddRecruitmentButton>
        </CustomInput>
        {!!hiringProgress.length && (
          <CustomInput>
            <VStack>{hiring_progress.map((progress) => hiringProgressType[progress]).join(" → ")}</VStack>
          </CustomInput>
        )}
        <Input
          name="submit_document"
          value={submit_document}
          required
          onChange={onChange}
          title="제출 서류"
          autoComplete="off"
        />
        <CustomInput required title="모집 기간">
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 20, marginTop: 10 }}>
            <DateContainer>
              <DateInput
                name="start_date"
                onChange={onChange}
                value={start_date}
                type="date"
                data-placeholder="모집 시작일"
              />
              <Text>~</Text>
              <DateInput
                name="end_date"
                onChange={onChange}
                value={end_date}
                type="date"
                data-placeholder="모집 마감일"
                aria-required="true"
              />
            </DateContainer>
            {/* <CheckBox>상시채용</CheckBox> */}
          </div>
        </CustomInput>
        <TextArea name="etc" value={etc} onChange={onChange} title="기타 사항" autoComplete="off" />

        <Stack gap={30} margin={["top", 100]}>
          <CancelButton onClick={() => router.push("/")}>취소</CancelButton>
          <ConfirmRequestButton
            onClick={() => {
              createRecruitmentRequest.mutate();
            }}
          >
            의뢰서 작성 완료
          </ConfirmRequestButton>
        </Stack>

        {modalState === "GATHER_FIELD" && (
          <Modal
            width={800}
            onClose={() => {
              closeModal();
              resetArea();
            }}
            closeAble
          >
            <GatherModal setForm={setForm} />
          </Modal>
        )}

        {modalState === "HIRING_PROGRESS" && (
          <Modal width={780} onClose={closeModal} closeAble>
            <ProgressModal hiringProgressArray={hiring_progress} setRecruitmentFormDetailInfo={setForm} />
          </Modal>
        )}
        {modalState === "LICENSE" && (
          <Modal width={700} onClose={closeModal}>
            <LicenseModal requiredLicensesArray={form.required_licenses} setForm={setForm} />
          </Modal>
        )}
      </RecruimentWrapper>
      {modalState === "USE_TECH" && (
        <Modal width={700} onClose={() => openModal("GATHER_FIELD")} closeAble>
          <TechModal />
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  background-color: ${theme.color.gray20};
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
`;

const RecruimentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  padding: 85px 105px;
  min-height: 400px;
  border-radius: 8px;
  background-color: white;
  margin-top: 56px;
  z-index: 99;
  overflow: hidden;
  margin-bottom: 60px;
`;

const RequireText = styled.div`
  display: flex;
  margin-top: 50px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: ${theme.color.liteBlue};
  font-weight: 400;
`;

const BlueStar = styled.div`
  font-size: 17px;
  color: ${theme.color.liteBlue};
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
  color: ${theme.color.gray60};
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  padding: 30px 0px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='gray' stroke-width='2' stroke-dasharray='10%2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 8px;
  background-color: ${theme.color.gray20};
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Text = styled.div`
  color: ${theme.color.gray60};
  ${theme.font.Body1};
`;

const Boxs = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  gap: 10px;
`;

const CancelButton = styled.div`
  padding: 12px 40px;
  border-radius: 3px;
  border: 1.5px solid #0f4c82;
  border-radius: 8px;
  color: #0f4c82;
  ${theme.font.Body2};
  cursor: pointer;
`;

const ConfirmRequestButton = styled.div`
  padding: 12px 40px;
  border-radius: 8px;
  background-color: ${theme.color.blue};
  ${theme.font.Body2};
  color: ${theme.color.gray10};
  cursor: pointer;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const DateContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #cccccc;
  gap: 20px;
`;

const DateInput = styled.input<{ $width?: number }>`
  width: ${({ $width }) => $width + "px"};
  outline: 0;
  border: 0;
  color: #7f7f7f;
`;

const AddRecruitmentButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${theme.color.gray50};
  margin-top: 10px;
  color: ${theme.color.gray60};
  padding: 8px 20px;
  border-radius: 8px;
  ${theme.font.Body3};
  cursor: pointer;
`;

const GradeInput = styled.input`
  margin: 5px 0px;
  display: flex;
  align-items: center;
  width: 40px;
  height: 15px;
  border: 0;
  outline: 0;
  text-align: center;
  border-bottom: 1px solid #cccccc;
  font-size: 12px;
`;

const Percent = styled.div`
  color: #7f7f7f;
  margin: 5px 0px;
`;

const Licenses = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  overflow: scroll;
  width: 490px;
  align-items: center;
  padding: 5px;
  margin: 5px;
`;

const LicenseButton = styled.button`
  border: none;
  padding: 5px 10px;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  height: 25px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.color.gray90};
  outline: none;
  white-space: nowrap;
  cursor: default;
`;

const AddLicenseButton = styled.button`
  color: ${theme.color.gray60};
  border-radius: 15px;
  padding: 4px 8px;
  border: 1px solid ${theme.color.gray60};
  ${theme.font.Caption};
  cursor: pointer;
`;

const XText = styled.div`
  margin-left: 7px;
  margin-top: -1px;
  cursor: pointer;
  color: red;
`;

const GatherFieldBox = styled.div`
  position: relative;
  width: 100%;
  min-height: 100px;
  overflow: hidden;
  padding: 20px 30px;
  background: #fdfdfd;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
`;

const FieldBoxTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  width: 400px;
`;

const PeopleCount = styled.div`
  position: absolute;
  top: 35px;
  right: 45px;
  font-size: 30px;
  font-weight: 700;
`;

const CancelIcon = styled(Image)`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const FieldText = styled.div`
  font-size: 14px;
  width: 400px;
  margin-top: 8px;
  color: #555555;
`;
