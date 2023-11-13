"use client";

import { css, styled } from "styled-components";
import { Stack, theme } from "@team-return/design-system";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IEditRecruitmentRequest, IHiringProgress, IRecruitment } from "@/apis/recruitments/types";
import dndIcon from "../../../public/dndIcon.svg";
import Image from "next/image";
import { hiringProgressType } from "@/utils/translate";
import selectIcon from "../../../public/selectIcon.svg";
import { useModal } from "@/hooks/useModal";

interface PropsType<T> {
  hiringProgressArray: IHiringProgress[];
  setRecruitmentFormDetailInfo: Dispatch<SetStateAction<T>>;
}

const ProgressModal = <T extends IRecruitment | IEditRecruitmentRequest>({
  hiringProgressArray,
  setRecruitmentFormDetailInfo,
}: PropsType<T>) => {
  const [state, setState] = useState<IHiringProgress[]>([]);

  const { closeModal } = useModal();
  const progress_list = Object.entries(hiringProgressType);

  const handleChange = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = [...state];
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);
    setState(items);
  };

  const clickHiringProgress = (progress: IHiringProgress) => {
    if (state.includes(progress)) {
      // progress 삭제
      setState(state.filter((progressType) => progressType !== progress));
    } else {
      // progress 추가
      setState([...state, progress]);
    }
  };

  const confirmProgress = async () => {
    setRecruitmentFormDetailInfo((prev) => ({ ...prev, hiring_progress: state }));
    closeModal();
  };

  useEffect(() => {
    setState(hiringProgressArray);
  }, [hiringProgressArray]);

  return (
    <Container>
      <Stack direction="column" width={300}>
        <Title>채용 방법</Title>
        <DndWrapper>
          <DragDropContext onDragEnd={handleChange}>
            <Droppable droppableId="progress">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {state.map((progress, idx) => {
                    return (
                      <Draggable key={idx} draggableId={String(idx)} index={idx}>
                        {(provided) => (
                          <DndItemWrapper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Image src={dndIcon} alt="" />
                            <DndText>{`${idx + 1}. ${hiringProgressType[progress as IHiringProgress]}`}</DndText>
                          </DndItemWrapper>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </DndWrapper>
      </Stack>
      <ProgressWrapper>
        <ProgressListWrapper>
          {progress_list.map((progress, i) => {
            const [progressType, progressName] = progress;
            return (
              <Card
                key={i}
                onClick={() => {
                  clickHiringProgress(progressType as IHiringProgress);
                }}
                isSelect={state.includes(progressType as IHiringProgress)}
              >
                {progressName}
                {state?.includes(progressType as IHiringProgress) && (
                  <SelectIconImg width={18} height={18} src={selectIcon} alt="icon" />
                )}
              </Card>
            );
          })}
        </ProgressListWrapper>
        <SuccessBtn onClick={confirmProgress}>확인</SuccessBtn>
      </ProgressWrapper>
    </Container>
  );
};

export default ProgressModal;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 730px;
  padding: 30px 30px 25px;
`;

const DndItemWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${theme.color.gray50};
  width: 300px;
  height: 50px;
  border-radius: 8px;
  margin-bottom: 5px;
`;

const DndWrapper = styled.div`
  margin-top: 14px;
  width: 330px;
  height: 320px;
  overflow: scroll;
`;

const DndText = styled.div`
  font-size: 14px;
  color: ${theme.color.gray60};
  font-weight: 600;
  margin-left: 2px;
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 400px;
  height: 360px;
  background-color: white;
  padding-top: 40px;
  margin-left: 30px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
  text-align: left;
`;

const ProgressListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 390px;
  height: 240px;
`;

const Card = styled.div<{ isSelect: boolean }>`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  color: ${({ isSelect }) => (isSelect ? theme.color.blue : "#A5A5A5")};
  font-weight: 500;
  border: 1.5px solid ${({ isSelect }) => (isSelect ? theme.color.blue : theme.color.gray50)};
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    ${({ isSelect }) =>
      !isSelect &&
      css`
        border: 1.5px solid ${theme.color.gray60};
        color: ${theme.color.gray70};
      `}
  }
`;

const SuccessBtn = styled.button`
  background: #ffffff;
  border: 1.5px solid #0f4c82;
  background-color: #0f4c82;
  color: white;
  border-radius: 3px;
  width: 390px;
  height: 40px;
  cursor: pointer;
  :disabled {
    background-color: ${theme.color.gray50};
    border: 1.5px solid ${theme.color.gray50};
    cursor: not-allowed;
  }
`;

const SelectIconImg = styled(Image)`
  position: absolute;
  top: -7px;
  right: -7px;
`;
