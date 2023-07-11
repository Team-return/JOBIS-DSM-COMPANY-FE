"use client";

import { useMyRecruitment } from "@/hooks/apis/useRecruitmentsApi";
import { HStack, Stack, Text, VStack, theme } from "@team-return/design-system";
import Image from "next/image";
import { styled } from "styled-components";
import { NoResult } from "./NoResult";
import { Spinner } from "../Spinner";
import { useMyCompanyInfo } from "@/hooks/apis/useCompanyApi";
import { hiringProgressType } from "@/utils/translate";

export const Recruitment = () => {
  const { data: myRecruitment, error, isLoading } = useMyRecruitment();
  const { data: myCompany } = useMyCompanyInfo();

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

  console.log(myRecruitment);

  return (
    <Container>
      <HStack gap={30}>
        <Logo width={80} height={80} src={myCompany?.company_logo_url || ""} alt="로고" />
        <HStack align="center" gap={20}>
          <Text color="gray90" size="Heading3">
            {myCompany?.name}
          </Text>
        </HStack>
      </HStack>
      <Line />
      <VStack gap={30}>
        <HStack>
          <Stack width={800}>
            <Title>모집 기간</Title>
            <Text color="gray90" size="Body1">
              {myRecruitment?.start_date} ~ {myRecruitment?.end_date}
            </Text>
          </Stack>
        </HStack>
        <Grid>
          <VStack gap={30}>
            <HStack>
              <Title>근무시간</Title>
              <Stack>
                <Text color="gray90" size="Body1">
                  {myRecruitment?.work_hours}시간
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>실습수당</Title>
              <Stack>
                <Text color="gray90" size="Body1">
                  {myRecruitment?.train_pay && myRecruitment.train_pay + "만원"}
                </Text>
              </Stack>
            </HStack>
          </VStack>
          <VStack gap={30}>
            <HStack>
              <Title>병역 특례</Title>
              <Text color="gray90" size="Body1">
                {myRecruitment?.military_support ? "있음" : "없음"}
              </Text>
            </HStack>
            <HStack>
              <Title>채용 전환 연봉</Title>
              <Text color="gray90" size="Body1">
                {myRecruitment?.pay && myRecruitment.pay + "만원"}
              </Text>
            </HStack>
          </VStack>
        </Grid>
        <HStack>
          <Title>사내 복지</Title>
          <Text color="gray90" size="Body1">
            {myRecruitment?.benefits}
          </Text>
        </HStack>
        <HStack>
          <Title>채용 절차</Title>
          <Text color="gray90" size="Body1">
            {myRecruitment?.hiring_progress.map((progress, i) => {
              return (
                <>
                  {i + 1}. {hiringProgressType[progress]}
                  <br />
                </>
              );
            })}
          </Text>
        </HStack>
        <HStack>
          <Title>필요 서류</Title>
          <Text color="gray90" size="Body1">
            {myRecruitment?.submit_document}
          </Text>
        </HStack>
        <HStack>
          <Title>실습생 업무 내용</Title>
          <Stack direction="column" width={800}>
            {myRecruitment?.areas.map((res, i) => {
              return (
                <Text key={i} color="gray90" size="Body1">
                  <Text size="Heading6">{res.job}</Text>
                  <br />
                  <Text>{res.tech.join(", ")}</Text>
                  <br />
                  {res.major_task}
                  <br />
                  <br />
                  <br />
                </Text>
              );
            })}
          </Stack>
        </HStack>
        <HStack>
          <Title>국가 자격증</Title>
          <Text color="gray90" size="Body1">
            {myRecruitment?.required_licenses.join(", ")}
          </Text>
        </HStack>
        <HStack>
          <Title>기초 성적</Title>
          <Text color="gray90" size="Body1">
            {myRecruitment?.required_grade}% 이내
          </Text>
        </HStack>
        <HStack>
          <Title>자격 우대사항</Title>
          <Stack width={800}>
            <Text color="gray90" size="Body1">
              {myRecruitment?.preferential_treatment}
            </Text>
          </Stack>
        </HStack>
        <HStack>
          <Title>기타사항</Title>
          <Text color="gray90" size="Body1">
            {myRecruitment?.etc}
          </Text>
        </HStack>
      </VStack>
    </Container>
  );
};

const Container = styled.div`
  width: 940px;
  min-height: 0px;
  margin: 0 auto;
  margin-top: 50px;
  padding-bottom: 60px;
`;

const Logo = styled(Image)`
  border: 1px solid ${theme.color.gray40};
`;

// const CompanyType = styled.div<{ color?: string }>`
//   display: flex;
//   justify-content: center;
//   align-itmes: center;
//   width: 80px;
//   border-radius: 100px;
//   padding: 5px 12px;
//   font-weight: 400;
//   font-size: 12px;
//   ${({ color }) => {
//     switch (color) {
//       case "PARTICIPATING":
//         return `
//         color: ${theme.color.success};
//         background-color: rgba(46, 204, 113, 0.1);
//         border: 1px solid ${theme.color.success};
//         `;
//       case "LEAD":
//         return `
//         color: ${theme.color.skyblue};
//         background-color: rgba(35, 123, 201, 0.1);
//         border: 1px solid ${theme.color.skyblue};
//         `;
//     }
//   }}
// `;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.color.gray50};
  margin: 40px 0;
`;

const Title = styled.div`
  width: 120px;
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
