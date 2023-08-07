"use client";

import { styled } from "styled-components";
import React from "react";
import OptionTitle from "../../OptionTitle";
import { Icon, Stack, VStack, theme } from "@team-return/design-system";
import { CustomInput, Input, TextArea } from "../../Input";
import { useInput } from "@/hooks/useInput";
import Image from "next/image";
import Add from "../../../../public/addField.svg";
import { useCreateRecruitmentRequest } from "@/hooks/apis/useRecruitmentsApi";
import Modal from "../../Modal";
import ProgressModal from "../../Modal/progressModal";
import { IHiringProgress, IRecruitment } from "@/apis/recruitments/types";
import { useModal } from "@/hooks/useModal";
import { useHiringProgressStore, useProgressListStore } from "@/store/progressState";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import GatherModal from "../../Modal/recruitmentModal";
import { useGetCode } from "@/hooks/apis/useCodeApi";
import TechModal from "../../Modal/techModal";
import { hiringProgressType } from "@/utils/translate";
import { KeyByValue } from "@/utils/useKeyByValue";
import LicenseModal from "@/components/Modal/licenseModal";
import XBtn from "../../../../public/X.svg";
import { useRouter } from "next/navigation";

export default function WriteRecruitments() {
  const date = new Date();
  const { hiringProgress, delteHiringProgress, dragHiringProgress } = useHiringProgressStore();

  const { form, onChange, setForm } = useInput<IRecruitment>({
    areas: [],
    preferential_treatment: "",
    required_licenses: [],
    required_grade: "",
    work_hours: "",
    train_pay: "",
    pay: "",
    benefits: "",
    military_support: false,
    hiring_progress: ["DOCUMENT"],
    submit_document: "",
    start_date: "",
    end_date: "",
    etc: "",
  });

  const {
    preferential_treatment,
    areas,
    required_grade,
    required_licenses,
    work_hours,
    train_pay,
    pay,
    benefits,
    military_support,
    submit_document,
    start_date,
    end_date,
    etc,
  } = form;

  const createRecruitmentRequest = useCreateRecruitmentRequest(form);

  const { modalState, closeModal, openModal } = useModal();

  const [setProgressList] = useProgressListStore((store) => [store.setProgressList]);

  const deleteProgress = (id: number) => {
    delteHiringProgress(id);
    setProgressList(id);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = hiringProgress;
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);

    dragHiringProgress(items);
    setForm((prev) => ({
      ...prev,
      hiring_progress: items.map((progress) => KeyByValue(hiringProgressType, progress.name) as IHiringProgress),
    }));
  };

  const { data: tech_name } = useGetCode("TECH");
  const { data: job_name } = useGetCode("JOB");

  const router = useRouter();

  return (
    <Container>
      <Title>모집의뢰서 등록</Title>
      <SubTitle>
        등록된 정보는 본 시스템을 통해 접수된 건에 한하여 정식적으로 검토되며
        <br />
        등록된 정보는 서비스 이용에 활용됩니다.
      </SubTitle>
      <RequireText>
        <BlueStar>*</BlueStar> 표시는 필수 입력 항목입니다.
      </RequireText>

      <OptionTitle title="모집년도" />
      <Input
        required
        onChange={() => {
          console.log();
        }}
        title="모집년도"
        value={`${date.getFullYear()}년도`}
      />

      <OptionTitle title="모집 분야" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Boxs>
          {areas.map((area, i) => {
            const { job_codes, tech_codes, hiring, major_task } = area;
            return (
              <GatherFieldBox key={i}>
                <FieldBoxTitle>
                  분야 : {job_name?.codes.filter((code) => job_codes.includes(code?.code)).join(" / ")}
                </FieldBoxTitle>
                <FieldText>
                  사용기술 :{" "}
                  {tech_name?.codes.map((code) => tech_codes.includes(code?.code) && code?.keyword + " ") || "없음"}
                </FieldText>
                <FieldText style={{ top: 70 }}>주요 업무 : {major_task || "없음"}</FieldText>
                <PeopleCount>{hiring}명</PeopleCount>
                <CancelIcon
                  width={10}
                  height={10}
                  onClick={() => setForm({ ...form, areas: areas.filter((res, idx) => idx !== i) })}
                  src={XBtn}
                  alt=""
                />
              </GatherFieldBox>
            );
          })}
        </Boxs>
        <BoxContainer onClick={() => openModal("GATHER_FIELD")}>
          <Wrapper>
            <Image alt="추가" src={Add} unoptimized />
            <Text>추가</Text>
            <BlueStar>*</BlueStar>
          </Wrapper>
        </BoxContainer>
      </div>

      <OptionTitle title="자격요건" />
      <TextArea name="preferential_treatment" title="우대사항" value={preferential_treatment} onChange={onChange} />
      <CustomInput title="필수사항">
        <VStack margin={["top", 20]}>
          <Label>
            <input
              type="checkbox"
              checked={required_licenses.length >= 1}
              disabled={!(required_licenses.length >= 1)}
            />
            국가자격증
          </Label>
          <Licenses>
            {required_licenses.map((license, i) => (
              <LicenseButton key={i}>
                {license}
                <XText
                  onClick={() => {
                    setForm({ ...form, required_licenses: required_licenses.filter((_, idx) => idx !== i) });
                  }}
                >
                  x
                </XText>
              </LicenseButton>
            ))}
            <AddLicenseButton onClick={() => openModal("LICENSE")}>+ 추가</AddLicenseButton>
          </Licenses>
          <Label>
            <input type="checkbox" checked={!!required_grade} disabled={!required_grade} />
            성적
          </Label>
          <Wrapper>
            <GradeInput
              name="required_grade"
              value={form.required_grade}
              onChange={onChange}
              min={0}
              max={100}
              maxLength={3}
            />
            <Percent>% 이내</Percent>
          </Wrapper>
        </VStack>
      </CustomInput>

      <OptionTitle title="근무조건" />
      <Input
        name="work_hours"
        value={work_hours}
        required
        onChange={onChange}
        title="근무시간"
        placeholder="시간"
        unit="시간"
      />
      <Input
        name="train_pay"
        value={train_pay}
        required
        onChange={onChange}
        title="실습수당"
        placeholder="만원/월"
        unit="만원/월"
      />
      <Input name="pay" value={pay} onChange={onChange} title="정규직 전환시" placeholder="만원/년" unit="만원/월" />
      <TextArea name="benefits" value={benefits} onChange={onChange} title="복리후생" />
      <CustomInput>
        <Label>
          <input
            name="military_support"
            checked={military_support}
            type="checkbox"
            onChange={() => setForm({ ...form, military_support: !military_support })}
          />
          병역특례 신청
        </Label>
      </CustomInput>

      <OptionTitle title="채용 절차" />
      <CustomInput title="채용 절차" required>
        <AddRecruitmentButton onClick={() => openModal("HIRING_PROGRESS")}>+</AddRecruitmentButton>
      </CustomInput>
      <CustomInput>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="progress">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <VStack width={475} gap={10}>
                  {hiringProgress.map((progress, i) => {
                    const { id, name } = progress;
                    return (
                      <Draggable key={id} draggableId={String(id)} index={i}>
                        {(provided) => (
                          <Box key={id} {...provided.draggableProps}>
                            <Equal ref={provided.innerRef} {...provided.dragHandleProps}>
                              =
                            </Equal>
                            <BoxText>
                              {i + 1}. {name}
                            </BoxText>
                            <CloseIcon cursor="pointer" icon="Close" size={20} onClick={() => deleteProgress(id)} />
                          </Box>
                        )}
                      </Draggable>
                    );
                  })}
                </VStack>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CustomInput>
      <Input name="submit_document" value={submit_document} required onChange={onChange} title="제출 서류" />
      <CustomInput required title="모집 기간">
        <DateContainer>
          <DateInput name="start_date" onChange={onChange} value={start_date} type="date" />
          <Text>~</Text>
          <DateInput name="end_date" onChange={onChange} value={end_date} type="date" />
        </DateContainer>
      </CustomInput>
      <TextArea name="etc" value={etc} onChange={onChange} title="기타 사항" />

      <Stack gap={30} margin={["top", 100]}>
        <CancelButton onClick={() => router.push("/login")}>취소</CancelButton>
        <ConfirmRequestButton
          onClick={() => {
            createRecruitmentRequest.mutate();
            router.push("/");
          }}
        >
          의뢰서 작성 완료
        </ConfirmRequestButton>
      </Stack>

      {modalState === "GATHER_FIELD" && (
        <Modal width={700} onClose={closeModal} closeAble>
          <GatherModal setForm={setForm} />
        </Modal>
      )}

      {modalState === "HIRING_PROGRESS" && (
        <Modal
          width={450}
          onClose={() => {
            closeModal();
            setForm((prev) => ({
              ...prev,
              hiring_progress: hiringProgress.map(
                (progress) => KeyByValue(hiringProgressType, progress.name) as IHiringProgress
              ),
            }));
          }}
          closeAble
        >
          <ProgressModal />
        </Modal>
      )}
      {modalState === "USE_TECH" && (
        <Modal width={700} onClose={() => openModal("GATHER_FIELD")} closeAble>
          <TechModal />
        </Modal>
      )}
      {modalState === "LICENSE" && (
        <Modal width={600} onClose={closeModal}>
          <LicenseModal setForm={setForm} />
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
  min-height: 400px;
  border-radius: 30px;
  background-color: white;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25));
  margin-top: 130px;
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

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 550px;
  height: 40px;
  border: 2px dashed #cccccc;
  border-radius: 10px;
  padding: 30px 0px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Text = styled.div`
  color: #b1b1b1;
  font-size: 16px;
  font-weight: 700;
  margin: 0px 5px;
`;

const Boxs = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  gap: 10px;
`;

const CancelButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  border: 1.5px solid #0f4c82;
  border-radius: 3px;
  color: #0f4c82;
  font-weight: 400;
  cursor: pointer;
`;

const ConfirmRequestButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  border-radius: 3px;
  background-color: #0f4c82;
  font-weight: 400;
  color: white;
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
`;

const DateInput = styled.input`
  outline: 0;
  border: 0;
  color: #7f7f7f;
`;

const AddRecruitmentButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #0f4c82;
  margin-top: 10px;
  color: #0f4c82;
  margin-left: auto;
  width: 75px;
  height: 30px;
  font-size: 20px;
  background-color: white;
  padding-bottom: 3px;
  cursor: pointer;
`;

const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 45px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
  background: #ffffff;
`;

const Equal = styled.div`
  font-size: 35px;
  font-weight: 330;
  margin-left: 25px;
  color: #7f7f7f;
`;

const BoxText = styled.div`
  font-size: 15px;
  margin-left: 30px;
  font-weight: 350;
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  right: 30px;
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

const AddLicenseButton = styled(LicenseButton)`
  color: ${theme.color.gray60};
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
  width: 550px;
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
