import Image from "next/image";
import NoGesture from "../../../../public/GestureNo.svg";
import { styled } from "styled-components";
import { Text, VStack, theme } from "@team-return/design-system";
import Link from "next/link";

export const NoResult = () => {
  return (
    <Container>
      <VStack align="center">
        <Image src={NoGesture} width={165} height={165} alt="" unoptimized />
        <Text color="gray90" size="Heading4">
          작성된 모집의뢰서가 없습니다
        </Text>
        <Link href="/recruitments/chose">
          <Button>
            <Text color="gray10" size="Body1">
              모집의뢰서 작성하러 가기
            </Text>
          </Button>
        </Link>
      </VStack>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 400px;
  margin: 0 auto;
  margin-top: 200px;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 60px;
  color: ${theme.color.gray10};
  border-radius: 20px;
  margin-top: 20px;
  background-color: ${theme.color.liteBlue};
  cursor: pointer;
`;
