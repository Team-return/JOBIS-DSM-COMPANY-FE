"use client";

import Register from "@/components/Auth/Register";
import Background from "@/components/Background";
import styled from "styled-components";

export default function Registration() {
  return (
    <Container>
      <Background />
      <Register />
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
