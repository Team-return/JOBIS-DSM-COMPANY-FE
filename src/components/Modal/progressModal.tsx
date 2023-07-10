"use client";

import { useHiringProgressStore, useProgressListStore } from "@/store/progressState";
import { styled } from "styled-components";

const ProgressModal = () => {
  const { progressList, setProgressList } = useProgressListStore();
  const { setHiringProgress, delteHiringProgress } = useHiringProgressStore();

  const Select = (id: number, name: string, isSelect: boolean) => {
    setProgressList(id);
    if (isSelect) {
      delteHiringProgress(id);
    } else {
      setHiringProgress(id, name);
    }
  };

  return (
    <Container>
      <Title>채용 방법 선택</Title>
      <Wrapper>
        {progressList.map((progress, i) => {
          const { isSelect, name } = progress;
          return (
            <Card key={i} onClick={() => Select(i, name, isSelect)} isSelect={isSelect}>
              {name}
            </Card>
          );
        })}
      </Wrapper>
    </Container>
  );
};

export default ProgressModal;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 450px;
  height: 370px;
  background-color: white;
`;

const Title = styled.div`
  position: absolute;
  font-size: 25px;
  font-weight: 600;
  top: 40px;
  left: 35px;
`;

const Wrapper = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 390px;
  height: 240px;
  bottom: 20px;
  overflow: scroll;
`;

const Card = styled.div<{ isSelect: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #000000;
  background-color: ${(props) => (props.isSelect ? "#F0F0F0" : "white")};
  font-weight: 400;
  width: 130px;
  height: 80px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isSelect ? null : "#0f4c82")};
    color: ${(props) => (props.isSelect ? null : "white")};
  }
`;
