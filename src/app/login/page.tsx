"use client";

import styled from "styled-components";
import SignIn from "../../components/Auth/SignIn";
import Background from "@/components/Background";

export default function Login() {
  return (
    <Container>
      <Background />
      <SignIn />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
