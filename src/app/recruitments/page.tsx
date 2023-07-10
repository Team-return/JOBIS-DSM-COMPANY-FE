"use client";

import Background from "@/components/Background";
import WriteRecruitments from "@/components/Recruitments/write";
import { styled } from "styled-components";

export default function Registration() {
  return (
    <Container>
      <Background />
      <WriteRecruitments />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
`;
