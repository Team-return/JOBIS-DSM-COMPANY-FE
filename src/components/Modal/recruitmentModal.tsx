import styled from "styled-components";
import { useGetCode } from "@/hooks/apis/useCodeApi";
import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { ICode } from "@/apis/codes/types";
import { useModal } from "@/hooks/useModal";
import { useTechState } from "@/store/techState";
import { theme } from "@team-return/design-system";
import { IRecruitment } from "@/apis/recruitments/types";
import { useAreaState } from "@/store/areasState";

const jobType = ["WEB", "APP", "GAME", "EMBEDDED", "SECURITY", "AI", "ASD"];

interface IPropsType {
  setForm: Dispatch<SetStateAction<IRecruitment>>;
}

const GatherModal = ({ setForm }: IPropsType) => {
  const { data: jobs } = useGetCode("JOB");
  const { closeModal } = useModal();

  const { area, setArea, resetArea } = useAreaState();

  const { techList, deleteTechList, resetTechList } = useTechState();
  const { openModal } = useModal();

  const PushArray = (tech: ICode) => {
    setArea({ ...area, job_codes: [...area.job_codes, tech.code] });
  };

  const DeleteArray = (code: number) => {
    setArea({ ...area, job_codes: area.job_codes.filter((datas) => datas !== code) });
  };

  const CheckArray = (tech: ICode) => {
    (area.job_codes.filter((datas) => datas === tech.code).length ? true : false)
      ? DeleteArray(tech.code)
      : PushArray(tech);
  };

  const Delete = (id: number) => {
    deleteTechList(id);
  };

  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = useCallback(() => {
    if (textRef && textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, []);

  return (
    <Container>
      <BigWrapper>
        <Title>
          채용직무<span style={{ color: "#0087FF" }}> *</span>
        </Title>
        <ContentsText>아래 제시된 분야중 해당하는 분야를 선택하세요.</ContentsText>
        <SmallWrapper>
          <FieldTitleWrapper>
            <FieldTitle>웹프로그래밍</FieldTitle>
            <FieldTitle>모바일</FieldTitle>
            <FieldTitle>게임</FieldTitle>
            <FieldTitle>임베디드</FieldTitle>
            <FieldTitle>보안</FieldTitle>
            <FieldTitle>인공지능</FieldTitle>
            <FieldTitle>응용프로그래밍</FieldTitle>
          </FieldTitleWrapper>
          <div>
            {jobType.map((type, idx) => {
              return (
                <FieldWrapper key={idx}>
                  <Field>
                    {jobs?.codes
                      .filter((code) => code.job_type === type)
                      .map((code, idx) => {
                        const techTech = {
                          code: code.code,
                          keyword: code.keyword,
                        };
                        return (
                          <JobCard
                            key={idx}
                            colorBool={area.job_codes.filter((datas) => datas === code.code).length ? true : false}
                            onClick={() => CheckArray(techTech)}
                          >
                            {code.keyword}
                          </JobCard>
                        );
                      })}
                  </Field>
                </FieldWrapper>
              );
            })}
          </div>
        </SmallWrapper>
      </BigWrapper>
      <BigWrapper>
        <Title>사용기술</Title>
        <ContentsText>필요한 기술 스택을 추가하세요.</ContentsText>
        <CardWrapper>
          {techList.map((res, idx) => {
            return (
              <>
                <Card key={idx}>
                  {res.keyword}
                  <XText onClick={() => Delete(res.code)}>x</XText>
                </Card>
              </>
            );
          })}
          <AddTechButton onClick={() => openModal("USE_TECH")}>+ 추가</AddTechButton>
        </CardWrapper>
      </BigWrapper>
      <BigWrapper>
        <Title>
          채용인원<span style={{ color: "#0087FF" }}> *</span>
        </Title>
        <ContentsText>채용할 인원을 입력해주세요.</ContentsText>
        <SmallWrapper>
          <NumInput
            type="number"
            min={0}
            value={area.hiring}
            onChange={(e) => {
              setArea({ ...area, hiring: +e.target.value });
            }}
          />
          <NumText>명</NumText>
        </SmallWrapper>
      </BigWrapper>
      <BigWrapper>
        <Title>
          상세직무<span style={{ color: "#0087FF" }}> *</span>
        </Title>
        <ContentsText>해당 직무에서 하는 일을 상세하게 입력해주세요.</ContentsText>
        <SmallWrapper>
          <Textarea
            ref={textRef}
            value={area.major_task}
            onInput={handleResizeHeight}
            onChange={(e) => setArea({ ...area, major_task: e.target.value })}
          />
        </SmallWrapper>
      </BigWrapper>
      <BigWrapper>
        <Title>
          우대사항<span style={{ color: "#0087FF" }}> *</span>
        </Title>
        <ContentsText>우대사항을 입력해주세요</ContentsText>
        <SmallWrapper>
          <Textarea
            ref={textRef}
            value={area.preferential_treatment}
            onInput={handleResizeHeight}
            onChange={(e) => setArea({ ...area, preferential_treatment: e.target.value })}
          />
        </SmallWrapper>
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
            setForm((prev) => ({ ...prev, areas: [...prev.areas, area] }));
            resetArea();
            resetTechList();
            closeModal();
          }}
        >
          확인
        </SuccessBtn>
      </BtnWrapper>
    </Container>
  );
};

export default GatherModal;

const Container = styled.div`
  border: 3px solid white;
  width: 800px;
  padding: 50px;
  height: 80vh;
  overflow: scroll;
  border-radius: 10px;
  background-color: white;
`;

const BigWrapper = styled.div`
  margin-bottom: 80px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  overflow: scroll;
  width: 490px;
  align-items: center;
  margin-left: 50px;
  padding: 5px;
  margin-top: 15px;
`;

const Card = styled.button`
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

const AddTechButton = styled(Card)`
  color: ${theme.color.gray60};
  cursor: pointer;
`;

const XText = styled.div`
  margin-left: 7px;
  margin-top: -1px;
  cursor: pointer;
  color: red;
`;

const SmallWrapper = styled.div`
  display: flex;
  margin-left: 60px;
  align-items: center;
`;

const Field = styled.div`
  margin-left: 40px;
`;

const FieldTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 19px;
`;

const BtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CancelBtn = styled.button`
  background: #ffffff;
  border: 1.5px solid #0f4c82;
  color: #0f4c82;
  border-radius: 3px;
  width: 93px;
  height: 40px;
  margin-right: 15px;
`;

const SuccessBtn = styled.button`
  background: #ffffff;
  border: 1.5px solid #0f4c82;
  background-color: #0f4c82;
  color: white;
  border-radius: 3px;
  width: 93px;
  height: 40px;
`;

const FieldTitle = styled.h3`
  height: 39px;
  margin: 15px 0px;
`;

const NumInput = styled.input`
  border: none;
  border-bottom: 1px solid #cccccc;
  width: 85px;
  height: 35px;
  padding: 10px;
  outline: none;
`;

const Textarea = styled.textarea`
  border: none;
  border-bottom: 1px solid #cccccc;
  width: 90%;
  height: 55px;
  padding: 10px;
  outline: none;
  resize: none;
`;

const NumText = styled.div`
  color: black;
  font-weight: 400;
  margin-top: 6px;
`;

const JobCard = styled.button<{ colorBool: boolean }>`
  height: 39px;
  padding: 0px 20px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  margin-right: 10px;
  border: none;
  background-color: ${(props) => (props.colorBool ? "#0F4C82" : "white")};
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => (props.colorBool ? "white" : "black")};
  cursor: pointer;
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0px;
`;

const ContentsText = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: #7f7f7f;
  margin: 10px 0px 0px 40px;
  text-align: left;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  text-align: left;
`;
