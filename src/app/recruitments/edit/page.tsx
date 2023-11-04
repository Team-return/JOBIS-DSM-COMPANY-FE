"use client";

import { useMyRecruitment, useUpdateRecruitment } from "@/hooks/apis/useRecruitmentsApi";
import { CheckBox, HStack, Icon, RadioButton, Stack, Text, VStack, theme } from "@team-return/design-system";
import Image from "next/image";
import { styled } from "styled-components";
import { useEffect } from "react";
import { useInput } from "@/hooks/useInput";
import { IEditRecruitmentRequest, IHiringProgress } from "@/apis/recruitments/types";
import { hiringProgressType } from "@/utils/translate";
import { useModalStateStore } from "@/store/modalStore";
import { useModal } from "@/hooks/useModal";

import { useAreaState } from "@/store/areasState";
import { useGetCode } from "@/hooks/apis/useCodeApi";
import Modal from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { NoResult } from "@/components/Recruitments/NoResult";
import EditRecruitAreaModal from "@/components/Modal/editRecruitArea";
import { useRouter } from "next/navigation";

export default function EditRecruiment() {
  const { data: myRecruitment, error, isLoading } = useMyRecruitment();
  const { modalState } = useModalStateStore();
  const { closeModal, openModal } = useModal();
  const { data: jobs } = useGetCode("JOB");
  const { data: techs } = useGetCode("TECH");

  const { form, setForm, onChange } = useInput<IEditRecruitmentRequest>({
    preferential_treatment: "",
    required_grade: undefined,
    required_licenses: [],
    work_hours: "",
    train_pay: "",
    pay: "",
    benefits: "",
    military: false,
    hiring_progress: [],
    submit_document: "",
    start_date: "",
    end_date: "",
    etc: "",
  });

  const { mutateAsync } = useUpdateRecruitment(form);

  useEffect(() => {
    if (myRecruitment) {
      setForm({
        preferential_treatment: myRecruitment.preferential_treatment,
        required_grade: myRecruitment.required_grade,
        required_licenses: myRecruitment.required_licenses,
        work_hours: myRecruitment.work_hours,
        train_pay: myRecruitment.train_pay,
        pay: myRecruitment.pay,
        benefits: myRecruitment.benefits,
        military: myRecruitment.military,
        hiring_progress: myRecruitment.hiring_progress,
        submit_document: myRecruitment.submit_document,
        start_date: myRecruitment.start_date,
        end_date: myRecruitment.end_date,
        etc: myRecruitment.etc,
      });
    }
  }, [myRecruitment, setForm]);

  const { setArea } = useAreaState();
  const router = useRouter();

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner position="center" size={50} />
      </LoadingContainer>
    );
  }

  if (error) {
    return <NoResult />;
  }

  return (
    <Container>
      <HStack gap={30}>
        <Logo
          width={80}
          height={80}
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${myRecruitment?.company_profile_url || ""}`}
          alt="로고"
        />
        <VStack>
          <HStack align="center" gap={20}>
            <Text color="gray90" size="Heading3">
              {myRecruitment?.company_name}
            </Text>
          </HStack>
          <Text color="gray60" size="Body2">
            사업자 번호
          </Text>
        </VStack>
        <MenuWrapper>
          <HStack gap={14}>
            <CancelButton onClick={() => router.push("/")}>취소</CancelButton>
            <SaveButton
              onClick={async () => {
                await mutateAsync(myRecruitment!.recruitment_id);
                router.push("/");
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
          <Stack width={800}>
            <Title>모집 기간 *</Title>
            <HStack align="center" gap={20} margin={["right", 100]}>
              <Input name="start_date" value={form.start_date} onChange={onChange} type="date" /> ~{" "}
              <Input name="end_date" value={form.end_date} onChange={onChange} type="date" />
            </HStack>
          </Stack>
        </HStack>
        <Grid>
          <VStack gap={30}>
            <HStack>
              <Title>근무시간 *</Title>
              <Stack>
                <UnitInputWrapper>
                  <Input name="work_hours" value={form.work_hours} onChange={onChange} />
                  <Unit>시간</Unit>
                </UnitInputWrapper>
              </Stack>
            </HStack>
            <HStack>
              <Title>실습수당 *</Title>
              <UnitInputWrapper>
                <Input name="train_pay" value={form.train_pay} onChange={onChange} />
                <Unit>만원</Unit>
              </UnitInputWrapper>
            </HStack>
          </VStack>
          <VStack gap={30}>
            <HStack>
              <Title>병역 특례 *</Title>
              <HStack gap={50}>
                <RadioButton
                  name="military"
                  checked={form.military}
                  onClick={() => setForm({ ...form, military: true })}
                >
                  있음
                </RadioButton>
                <RadioButton
                  name="military"
                  checked={!form.military}
                  onClick={() => setForm({ ...form, military: false })}
                >
                  없음
                </RadioButton>
              </HStack>
            </HStack>
            <HStack>
              <Title>채용 전환 연봉</Title>
              <UnitInputWrapper>
                <Input name="pay" value={form.pay} onChange={onChange} />
                <Unit>만원</Unit>
              </UnitInputWrapper>
            </HStack>
          </VStack>
        </Grid>
        <HStack>
          <Title>사내 복지</Title>
          <VStack width={800}>
            <TextArea name="benefits" value={form.benefits} onChange={onChange} />
          </VStack>
        </HStack>
        <HStack>
          <Title>채용 절차 *</Title>
          <VStack width={800}>
            <HiringProgressGrid>
              {Object.entries(hiringProgressType)
                .filter((hiringProgress) => hiringProgress[1] !== "")
                .map((hiringProgress, idx) => (
                  <CheckBox
                    key={idx}
                    checked={form.hiring_progress.includes(hiringProgress[0] as IHiringProgress)}
                    onClick={() =>
                      form.hiring_progress.includes(hiringProgress[0] as IHiringProgress)
                        ? setForm({
                            ...form,
                            hiring_progress: form.hiring_progress.filter((progress) => progress !== hiringProgress[0]),
                          })
                        : setForm({
                            ...form,
                            hiring_progress: [...form.hiring_progress, hiringProgress[0] as IHiringProgress],
                          })
                    }
                  >
                    {hiringProgress[1]}
                  </CheckBox>
                ))}
            </HiringProgressGrid>
          </VStack>
        </HStack>
        <HStack>
          <Title>필요 서류 *</Title>
          <VStack width={800}>
            <Input name="submit_document" value={form.submit_document} onChange={onChange} />
          </VStack>
        </HStack>
        <HStack>
          <Title>실습생 업무 내용*</Title>
          <Stack direction="column" width={800} gap={20}>
            {myRecruitment?.areas.map((area, idx) => {
              return (
                <AreaBox key={idx}>
                  <HStack justify="space-between" align="center">
                    <AreaJob>
                      {area.job.join(", ")} ({area.hiring}명)
                    </AreaJob>
                    <EditIconBackground onClick={() => openModal("EDIT_RECRUIT_AREA")}>
                      <Icon
                        icon="EditPencil"
                        size={24}
                        color="liteBlue"
                        onClick={() => {
                          setArea({
                            id: area.id,
                            job_codes: area.job.map(
                              (res) => jobs?.codes.find((code) => code.keyword == res)?.code || 0
                            ),
                            tech_codes: area.tech.map(
                              (res) => techs?.codes.find((code) => code.keyword == res)?.code || 0
                            ),
                            hiring: area.hiring,
                            major_task: area.major_task,
                          });
                        }}
                      />
                    </EditIconBackground>
                  </HStack>
                  <br />
                  {area.tech.join(", ")}
                  <br />
                  <br />
                  <Text whitespace="pre-line">{area.major_task}</Text>
                </AreaBox>
              );
            })}
            <PlusIconBackground>
              <Icon icon="Plus" color="liteBlue" size={24} />
            </PlusIconBackground>
          </Stack>
        </HStack>
        <HStack>
          <Title>국가 자격증</Title>
          <VStack width={800}>
            <TextArea name="required_licenses" value={form.required_licenses} onChange={onChange} />
          </VStack>
        </HStack>
        <HStack>
          <Title>기초 성적</Title>
          <UnitInputWrapper>
            <Input name="required_grade" value={form.required_grade} onChange={onChange} />
            <Unit>% 이내</Unit>
          </UnitInputWrapper>
        </HStack>
        <HStack>
          <Title>자격 우대사항</Title>
          <VStack width={800}>
            <TextArea name="preferential_treatment" value={form.preferential_treatment} onChange={onChange} />
          </VStack>
        </HStack>
        <HStack>
          <Title>기타사항</Title>
          <VStack width={800}>
            <TextArea name="etc" value={form.etc} onChange={onChange} />
          </VStack>
        </HStack>
      </VStack>
      {modalState === "EDIT_RECRUIT_AREA" && (
        <Modal width={700} onClose={closeModal} closeAble>
          <EditRecruitAreaModal setForm={setForm} />
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
  padding-bottom: 60px;
`;

const Logo = styled(Image)`
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(112, 144, 176, 0.15);
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.color.gray50};
  margin: 40px 0;
`;

const Title = styled.div`
  display: flex;
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

const Unit = styled.div`
  position: absolute;
  right: 15px;
  font-size: 18px;
  font-weight: 400;
  color: ${theme.color.gray60};
`;

const UnitInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: default;
`;

const HiringProgressGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
`;

const AreaBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 200px;
  border-radius: 2px;
  border: 1px solid ${theme.color.gray50};
  background-color: ${theme.color.gray10};
  padding: 18px 30px 30px 30px;
  font-size: 18px;
  font-weight: 400;
`;

const AreaJob = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.color.gray70};
`;

const EditIconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: ${theme.color.gray30};
  border-radius: 50px;
  cursor: pointer;
`;

const PlusIconBackground = styled(EditIconBackground)`
  margin: 30px auto 50px;
  border: 1px solid ${theme.color.liteBlue};
  border-radius: 50px;
  background-color: ${theme.color.gray10};
`;
