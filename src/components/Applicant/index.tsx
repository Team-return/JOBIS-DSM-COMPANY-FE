"use client";

import { useCompanyApplicants } from "@/hooks/apis/useApplicationApi";
import { Stack, Text, VStack, theme } from "@team-return/design-system";
import Image from "next/image";
import { styled } from "styled-components";
import { NoResult } from "../Recruitments/NoResult";
import { Spinner } from "../Spinner";
import Link from "next/link";

export const Applicant = () => {
  const { data, isLoading, error } = useCompanyApplicants();

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

  console.log(data);

  return (
    <Container>
      <Text color="gray90" size="Heading4" margin={["top", 50]}>
        지원자 현황
      </Text>
      <Grid>
        {data?.applications.map((res, i) => {
          return (
            <ApplicationContainer key={i}>
              <Stack align="center">
                <ProfileImg src={res.profile_image_url} width={50} height={50} alt="" unoptimized />
                <VStack margin={["left", 15]}>
                  <Text size="Body3">{res.student_name}</Text>
                  <Text size="Body4" color="gray60">
                    {res.student_number}
                  </Text>
                </VStack>
              </Stack>
              <Divider />
              <VStack gap={4}>
                <Text color="gray50" size="Body3">
                  url
                </Text>
                {res.attachments?.map(
                  (attachment, idx) =>
                    attachment.type == "URL" && (
                      <Link key={idx} href={attachment.url} passHref>
                        <Url target="_blank" rel="noopener noreferrer">
                          {attachment.url}
                        </Url>
                      </Link>
                    )
                )}
              </VStack>
              <VStack>
                <Text size="Body3" color="gray50">
                  첨부파일
                </Text>
                {res.attachments?.map(
                  (attachment, idx) =>
                    attachment.type == "FILE" && (
                      <Link key={idx} href={attachment.url} passHref>
                        <Url>{attachment.url}</Url>
                      </Link>
                    )
                )}
              </VStack>
              <CreateDate color="gray60" size="Caption">
                {res.created_at}
              </CreateDate>
            </ApplicationContainer>
          );
        })}
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  width: 940px;
  min-height: 0px;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 30px;
`;

const LoadingContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 200px);
`;

const ApplicationContainer = styled.div`
  position: relative;
  padding: 20px 22px;
  width: 297px;
  min-height: 396px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  transition: 1s;
  &:hover {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
  }
  overflow: hidden;
`;

const ProfileImg = styled(Image)`
  border-radius: 5px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1.5px;
  background-color: ${theme.color.gray40};
  margin: 14px 0;
`;

const CreateDate = styled(Text)`
  position: absolute;
  bottom: 20px;
  right: 24px;
`;

const Url = styled.a`
  display: inline-block;
  color: #237bc9;
  font-size: 14px;
  font-weight: 400;
  width: 253px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-decoration: underline;
`;
