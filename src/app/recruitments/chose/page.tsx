"use client";
import { Stack, Text, theme } from "@team-return/design-system";
import Image from "next/image";
import styled from "styled-components";
import WinterInternType from "../../../../public/winterIntern.svg";
import RecruimentType from "../../../../public/recruimentType.svg";
import Link from "next/link";

export default function Chose() {
  return (
    <Wrapper>
      <Text size="Heading1">모집 구분 선택하기</Text>
      <Stack gap={70}>
        <RecruitmentTypeCard>
          <Image width={130} height={130} src={RecruimentType} alt="recruitment" />
          <Link href="/recruitments">
            <SelectButton>채용형 현장실습 작성</SelectButton>
          </Link>
          <Text align="center" size="Body3">
            대덕소프트웨어마이스터고등학교의 3학년 학생들을
            <br />
            대상으로 채용형 현장실습생으로
            <br />
            채용할 수 있는 모집의뢰서입니다.
          </Text>
        </RecruitmentTypeCard>
        <RecruitmentTypeCard>
          <Image width={130} height={130} src={WinterInternType} alt="winter" />
          <Link href="/recruitments?type=winter">
            <SelectButton>체험형 현장실습 작성</SelectButton>
          </Link>
          <Text align="center" size="Body3">
            대덕소프트웨어마이스터고등학교의 2학년 학생들을 <br />
            대상으로 약 6주간 채험형 현장실습생으로
            <br />
            채용할 수 있는 모집의뢰서입니다.
          </Text>
        </RecruitmentTypeCard>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  flex-direction: column;
  gap: 50px;
`;

const RecruitmentTypeCard = styled.div`
  width: 360px;
  height: 480px;
  border: 1px solid ${theme.color.gray60};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
  justify-content: center;
  padding: 33px;
`;

const SelectButton = styled.button`
  width: 300px;
  background-color: ${theme.color.liteBlue};
  height: 60px;
  border-radius: 20px;
  font-size: 18px;
  color: ${theme.color.gray10};
  font-weight: 400;
`;
