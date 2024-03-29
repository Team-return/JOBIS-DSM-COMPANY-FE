"use client";

import { useMyCompanyInfo } from "@/hooks/apis/useCompanyApi";
import { HStack, Stack, Text, VStack, theme, Icon } from "@team-return/design-system";
import Image from "next/image";
import { styled } from "styled-components";
import { Spinner } from "@/components/Spinner";
import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import { companyType } from "@/utils/translate";
import { regex } from "@/utils/regex";
import { useQueryClient } from "@tanstack/react-query";

export default function MyPage() {
  const { data: myCompany, isLoading } = useMyCompanyInfo();
  const [dropdown, setDropDown] = useState(false);
  const router = useRouter();
  const cookie = new Cookies();
  const { phone_number, buisness_number } = regex;
  const queryClient = useQueryClient();

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
            {buisness_number(myCompany?.biz_no || "")}
          </Text>
        </VStack>
        <MenuWrapper>
          {dropdown && (
            <OutsideClickHandler onOutsideClick={() => setDropDown(false)}>
              <MoreDetail>
                <div
                  style={{ width: "100%", cursor: "pointer" }}
                  onClick={() => {
                    router.push("/mypage/edit");
                    setDropDown(false);
                  }}
                >
                  기업정보 수정
                </div>
                <div
                  style={{ color: "red", width: "100%", cursor: "pointer" }}
                  onClick={() => {
                    cookie.remove("access_token");
                    cookie.remove("refresh_token");
                    setDropDown(false);
                    router.push("/login");
                    queryClient.removeQueries();
                  }}
                >
                  로그아웃
                </div>
              </MoreDetail>
            </OutsideClickHandler>
          )}
          <Icon onClick={() => setDropDown(true)} icon="KebabMenu" />
        </MenuWrapper>
      </HStack>
      <Line />
      <VStack gap={30}>
        <HStack>
          <Stack width={940}>
            <Title>대표 서비스명</Title>

            <Stack align="center" height={45}>
              <Text color="gray90" size="Body1">
                {myCompany?.service_name}
              </Text>
            </Stack>
          </Stack>
        </HStack>
        <HStack>
          <Stack width={940}>
            <Title>회사소개</Title>
            <Stack width={780} margin={["top", 10]}>
              <Text color="gray90" size="Body1">
                {myCompany?.company_introduce || "-"}
              </Text>
            </Stack>
          </Stack>
        </HStack>
        <HStack>
          <Title>본사주소</Title>

          <Stack align="center" height={45}>
            <Text color="gray90" size="Body1">
              {(myCompany?.main_address || "") + " " + (myCompany?.main_address_detail || "")}
            </Text>
          </Stack>
        </HStack>
        <HStack>
          <Title>지점 주소</Title>
          <Stack align="center" height={45}>
            <Text color="gray90" size="Body1">
              {(myCompany?.sub_address || "-") + " " + (myCompany?.sub_address_detail || "")}
            </Text>
          </Stack>
        </HStack>
        <Grid>
          <VStack gap={30}>
            <HStack>
              <Title>대표</Title>

              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {myCompany?.representative || "-"}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>설립일</Title>

              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {myCompany?.founded_at || "-"}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>담당자1</Title>

              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {myCompany?.manager_name || "-"}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>담당자2</Title>

              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {myCompany?.sub_manager_name || "-"}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>이메일</Title>

              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {myCompany?.email || "-"}
                </Text>
              </Stack>
            </HStack>
          </VStack>
          <VStack gap={30}>
            <HStack>
              <Title>사업자번호</Title>
              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {buisness_number(myCompany?.biz_no || "-")}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>근로자 수</Title>
              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {myCompany?.workers_count || "-"}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>전화번호1</Title>
              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {phone_number(myCompany?.manager_phone_no || "")}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>전화번호2</Title>
              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {phone_number(myCompany?.sub_manager_phone_no || "") || "-"}
                </Text>
              </Stack>
            </HStack>
            <HStack>
              <Title>팩스</Title>
              <Stack align="center" height={45}>
                <Text color="gray90" size="Body1">
                  {phone_number(myCompany?.fax || "") || "-"}
                </Text>
              </Stack>
            </HStack>
          </VStack>
        </Grid>
      </VStack>
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
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(112, 144, 176, 0.15);
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
  /* cursor: pointer; */
  margin: auto 0 auto auto;
  height: 80px;
  display: flex;
  align-items: center;
`;

const MoreDetail = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  bottom: 0;
  right: 0;
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
