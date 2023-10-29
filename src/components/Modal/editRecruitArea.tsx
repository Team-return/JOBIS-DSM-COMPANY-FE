import styled from "styled-components";
import { useGetCode } from "@/hooks/apis/useCodeApi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ICode } from "@/apis/codes/types";
import { useModal } from "@/hooks/useModal";
import { useTechState } from "@/store/techState";
import { CheckBox, HStack, Icon, Stack, Text, VStack, theme } from "@team-return/design-system";
import { IEditRecruitmentRequest } from "@/apis/recruitments/types";
import { useAreaState } from "@/store/areasState";
import { useMyRecruitment, useUpdateRecruitArea } from "@/hooks/apis/useRecruitmentsApi";

const jobType = ["WEB", "APP", "GAME", "EMBEDDED", "SECURITY", "AI", "ASD"];

interface IPropsType {
  setForm: Dispatch<SetStateAction<IEditRecruitmentRequest>>;
}

const EditRecruitArea = ({ setForm }: IPropsType) => {
  const { data: jobs } = useGetCode("JOB");
  const { data: techs } = useGetCode("TECH");
  const { closeModal } = useModal();
  const [hoverTechId, setHoverTechId] = useState(0);

  const { area, setArea, resetArea } = useAreaState();

  const { techList, resetTechList } = useTechState();

  console.log(techs);

  const { data: myRecruitment } = useMyRecruitment();
  const { mutate } = useUpdateRecruitArea({ ...area, id: undefined });

  useEffect(() => {
    if (myRecruitment) {
      setArea({
        id: area.id,
        tech_codes: area.tech_codes,
        hiring: area.hiring,
        major_task: area.major_task,
        job_codes: area.job_codes,
      });
    }
  }, [myRecruitment]);

  const PushArray = (tech: ICode) => {
    setArea({ ...area, job_codes: [...area.job_codes, tech.code] });
  };

  const DeleteArray = (code: number) => {
    setArea({ ...area, job_codes: area.job_codes.filter((datas) => datas !== code) });
  };

  const CheckArray = (tech: ICode) => {
    (area?.job_codes?.filter((datas) => datas === tech.code).length ? true : false)
      ? DeleteArray(tech.code)
      : PushArray(tech);
  };

  // const Delete = (id: number) => {
  //   deleteTechList(id);
  // };

  console.log(techList);
  console.log(area);

  return (
    <>
      <Container>
        <Text size="Heading5" color="liteBlue" align="start">
          채용 절차
        </Text>
        <Stack align="center" margin={["bottom", 70]}>
          <FieldTitleWrapper>
            <FieldTitle>웹프로그래밍</FieldTitle>
            <FieldTitle>모바일</FieldTitle>
            <FieldTitle>게임</FieldTitle>
            <FieldTitle>임베디드</FieldTitle>
            <FieldTitle>보안</FieldTitle>
            <FieldTitle>인공지능</FieldTitle>
            <FieldTitle>응용프로그래밍</FieldTitle>
          </FieldTitleWrapper>
          <VStack gap={30}>
            {jobType.map((type, i) => {
              return (
                <FieldWrapper key={i}>
                  <Field>
                    {jobs?.codes
                      .filter((code) => code.job_type === type)
                      .map((code, i) => {
                        const techTech = {
                          code: code.code,
                          keyword: code.keyword,
                        };
                        return (
                          <CheckBox
                            key={i}
                            checked={area?.job_codes?.filter((datas) => datas === code.code).length ? true : false}
                            onClick={() => CheckArray(techTech)}
                          >
                            {code.keyword}
                          </CheckBox>
                        );
                      })}
                  </Field>
                </FieldWrapper>
              );
            })}
          </VStack>
        </Stack>
        <BigWrapper>
          <Text size="Heading5" color="liteBlue" align="start" margin={["bottom", 20]}>
            사용기술
          </Text>
          <TechItemWrapper>
            {area.tech_codes.map((tech, idx) => {
              return (
                <TechItem key={idx} onMouseEnter={() => setHoverTechId(idx + 1)} onMouseLeave={() => setHoverTechId(0)}>
                  {techs?.codes.find((code) => code.code === tech)?.keyword}
                  {idx + 1 === hoverTechId && (
                    <IconWrapper
                      onClick={() => setArea({ ...area, tech_codes: area.tech_codes.filter((code) => code !== tech) })}
                    >
                      <Icon icon="Close" color="gray10" size={16} />
                    </IconWrapper>
                  )}
                </TechItem>
              );
            })}
          </TechItemWrapper>
        </BigWrapper>
        <BigWrapper>
          <Text size="Heading5" color="liteBlue" align="start" margin={["bottom", 16]}>
            채용인원
          </Text>
          <HStack>
            <UnitInputWrapper>
              <Input
                name="hiring"
                min={0}
                type="number"
                value={area.hiring}
                onChange={(e) => setArea({ ...area, hiring: parseInt(e.target.value) })}
              />
              <Unit>명</Unit>
            </UnitInputWrapper>
          </HStack>
        </BigWrapper>
        <BigWrapper>
          <Text size="Heading5" color="liteBlue" align="start" margin={["bottom", 16]}>
            주요 업무
          </Text>
          <TextArea
            name="major_task"
            value={area.major_task}
            onChange={(e) => setArea({ ...area, major_task: e.target.value })}
          />
        </BigWrapper>
        <BtnWrapper>
          <CancelBtn
            onClick={() => {
              closeModal();
              resetArea();
              resetTechList();
            }}
          >
            취소
          </CancelBtn>
          <SuccessBtn
            onClick={() => {
              mutate(area.id || 0);
              setForm((prev) => ({ ...prev, areas: [area] }));
              resetArea();
              resetTechList();
              closeModal();
            }}
          >
            확인
          </SuccessBtn>
        </BtnWrapper>
      </Container>
    </>
  );
};

export default EditRecruitArea;

const Container = styled.div`
  width: 700px;
  padding: 50px;
  height: 80vh;
  overflow: scroll;
  border-radius: 2px;
  background-color: white;
`;

const BigWrapper = styled.div`
  margin-bottom: 80px;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  height: 39px;
  margin-left: 40px;
`;

const FieldTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 19px;
`;

const BtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 14px;
`;

const FieldTitle = styled.h3`
  height: 39px;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  margin: 15px 0px;
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SuccessBtn = styled.div`
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
  cursor: pointer;
`;

const CancelBtn = styled(SuccessBtn)`
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
  &::-webkit-inner-spin-button {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
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

const TechItem = styled.button`
  position: relative;
  min-width: 70px;
  padding: 7px 22px;
  background-color: ${theme.color.gray30};
  border-radius: 2px;
`;

const TechItemWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: -5px;
  top: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: ${theme.color.gray70};
  border-radius: 50px;
`;
