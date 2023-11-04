import { styled } from "styled-components";
import React from "react";

interface OptiionTitleProps {
  title?: string;
}

const OptionTitle = ({ title }: OptiionTitleProps) => {
  return (
    <OptionTitleContainer>
      <Title>{title}</Title>
    </OptionTitleContainer>
  );
};

export default OptionTitle;

const OptionTitleContainer = styled.div`
  width: 100%;
  height: 36px;
  border-bottom: 1px solid black;
  margin: 24px 0px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
`;
