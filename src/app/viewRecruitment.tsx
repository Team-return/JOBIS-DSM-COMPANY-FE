import { useMyRecruitment } from "@/hooks/apis/useRecruitmentsApi";
import { HStack, Icon, Stack, Text, VStack, theme } from "@team-return/design-system";
import Image from "next/image";
import { styled } from "styled-components";

import OutsideClickHandler from "react-outside-click-handler";
import { SetStateAction, useEffect, useState } from "react";
import { useInput } from "@/hooks/useInput";
import { IEditRecruitmentRequest } from "@/apis/recruitments/types";
import { hiringProgressType } from "@/utils/translate";
import { Spinner } from "@/components/Spinner";
import { NoResult } from "@/components/Recruitments/NoResult";
import { regex } from "@/utils/regex";
import { useRouter } from "next/navigation";

export default function ViewRecruitment({ setCanEdit }: { setCanEdit: React.Dispatch<SetStateAction<boolean>> }) {
  const { data: myRecruitment, error, isLoading } = useMyRecruitment();
  const [dropdown, setDropDown] = useState(false);
  const router = useRouter();

  const { setForm } = useInput<IEditRecruitmentRequest>({
    required_grade: undefined,
    required_licenses: [],
    start_time: "",
    end_time: "",
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

  const { money, buisness_number } = regex;

  useEffect(() => {
    if (myRecruitment) {
      setForm({
        required_grade: myRecruitment.required_grade,
        required_licenses: myRecruitment.required_licenses,
        start_time: myRecruitment.start_time,
        end_time: myRecruitment.end_time,
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
            {buisness_number(myRecruitment?.company_biz_no || "")}
          </Text>
        </VStack>
        <MenuWrapper>
          {dropdown && (
            <OutsideClickHandler onOutsideClick={() => setDropDown(false)}>
              <MoreDetail>
                <div
                  style={{ width: "100%", cursor: "pointer" }}
                  onClick={() => {
                    setCanEdit(true);
                    setDropDown(false);
                  }}
                >
                  모집의뢰서 수정
                </div>
                <div
                  style={{ width: "100%", cursor: "pointer" }}
                  onClick={() => {
                    setDropDown(false);
                    router.push("/recruitments/chose");
                  }}
                >
                  모집의뢰서 추가
                </div>
              </MoreDetail>
            </OutsideClickHandler>
          )}
          <Icon
            onClick={() => {
              setDropDown(true);
            }}
            icon="KebabMenu"
          />
        </MenuWrapper>
      </HStack>
      <Line />
      <VStack gap={30}>
        <HStack>
          <Stack width={800}>
            <Title>모집 기간 *</Title>
            <Text color="gray90" size="Body1">
              {myRecruitment?.start_date} ~ {myRecruitment?.end_date}
            </Text>
          </Stack>
        </HStack>
        <Grid>
          <VStack gap={30}>
            <HStack>
              <Title>근무시간 *</Title>
              <Stack>
                <Text color="gray90" size="Body1">
                  {myRecruitment?.start_time.slice(0, 5)} ~ {myRecruitment?.end_time.slice(0, 5)}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>실습수당 *</Title>
              <Text color="gray90" size="Body1">
                {myRecruitment?.train_pay && money(myRecruitment?.train_pay.toString()) + "원"}
              </Text>
            </HStack>
          </VStack>
          <VStack gap={30}>
            <HStack>
              <Title>병역특례 신청 계획 *</Title>
              <Text color="gray90" size="Body1">
                {myRecruitment?.military ? "있음" : "없음"}
              </Text>
            </HStack>
            <HStack>
              <Title>채용 전환 연봉</Title>
              <Text color="gray90" size="Body1">
                {myRecruitment?.pay ? myRecruitment.pay + "만원" : "-"}
              </Text>
            </HStack>
          </VStack>
        </Grid>
        <HStack>
          <Title>사내 복지</Title>
          <VStack width={800}>
            <Text color="gray90" size="Body1">
              {myRecruitment?.benefits || "-"}
            </Text>
          </VStack>
        </HStack>
        <HStack>
          <Title>채용 절차 *</Title>
          <VStack width={800}>
            <Text color="gray90" size="Body1">
              {myRecruitment?.hiring_progress.map((progress) => hiringProgressType[progress]).join(" → ")}
            </Text>
          </VStack>
        </HStack>
        <HStack>
          <Title>필요 서류 *</Title>
          <VStack width={800}>
            <Text color="gray90" size="Body1">
              {myRecruitment?.submit_document}
            </Text>
          </VStack>
        </HStack>
        <HStack>
          <Title>실습생 업무 내용*</Title>
          <Stack direction="column" width={800} gap={20}>
            {myRecruitment?.areas.map((area, idx) => {
              return (
                <Text key={idx} color="gray90" size="Body1">
                  <Text size="Heading6">
                    {area.job.join(", ")} ({area.hiring}명)
                  </Text>
                  <br />
                  <Text>{area.tech.join(", ")}</Text>
                  <br />
                  {area.major_task}
                  <br />
                  <br />
                  <br />
                  {area.preferential_treatment}
                </Text>
              );
            })}
          </Stack>
        </HStack>
        <HStack>
          <Title>국가 자격증</Title>
          <VStack width={800}>
            <Text color="gray90" size="Body1">
              {myRecruitment?.required_licenses.join(", ") || "-"}
            </Text>
          </VStack>
        </HStack>
        <HStack>
          <Title>기초 성적</Title>
          <Text color="gray90" size="Body1">
            {myRecruitment?.required_grade || "-"}
            {myRecruitment?.required_grade && " % 이내"}
          </Text>
        </HStack>
        <HStack>
          <Title>기타사항</Title>
          <VStack width={800}>
            <Text color="gray90" size="Body1" whitespace="pre-line">
              {myRecruitment?.etc || "-"}
            </Text>
          </VStack>
        </HStack>
      </VStack>
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
  /* align-items: center; */
  padding-top: 4px;
  min-width: 120px;
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

const MoreDetail = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  bottom: 0;
  right: 0;
  align-items: center;
  background-color: ${theme.color.gray10};
  color: ${theme.color.gray80};
  font-size: 18px;
  min-height: 30px;
  min-width: 100px;
  gap: 10px;
  border-radius: 5px;
  padding: 10px 22px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.25);
  z-index: 99;
  white-space: nowrap;
`;

// 나중에 사용 예정
// const CompanyType = styled.div<{ color?: string }>`
//   display: flex;
//   justify-content: center;
//   align-items: center;
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
