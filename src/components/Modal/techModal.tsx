import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { useGetCode } from "@/hooks/apis/useCodeApi";
import { ICode } from "@/apis/codes/types";
import { theme } from "@team-return/design-system";
import { useModal } from "@/hooks/useModal";
import { useTechState } from "@/store/techState";
import Image from "next/image";
import SearchBtn from "../../../public/Search_btn.svg";
import { Spinner } from "../Spinner";
import { useAreaState } from "@/store/areasState";

const TechModal = () => {
  const { data: techs, isLoading } = useGetCode("TECH");
  const { techList, appendTechList, deleteTechList } = useTechState();
  const { area, setArea } = useAreaState();
  const [search, setSearch] = useState("");

  const { openModal } = useModal();

  const CheckArray = (tech: ICode) => {
    (techList.filter((datas) => datas.code === tech.code).length ? true : false)
      ? DeleteArray(tech.code)
      : PushArray(tech);
  };

  const DeleteArray = (code: number) => {
    deleteTechList(code);
  };

  const PushArray = (tech: ICode) => {
    appendTechList(tech);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (isLoading)
    return (
      <Container>
        <Spinner position="center" size={30} />
      </Container>
    );

  return (
    <>
      <Container>
        <TitleWrapper>
          <div>
            <Title>사용기술 선택</Title>
            <ContentsText>해당 직무에 필요한 기술을 선택하세요.</ContentsText>
          </div>
          <div>
            <SearchInput type="text" value={search} onChange={onChange} />
            <SearchIcon src={SearchBtn} width={40} height={40} alt="" unoptimized />
          </div>
        </TitleWrapper>
        <SmallCardWrapper>
          {techList.map((res, idx) => {
            return (
              <>
                <SmallCard key={idx}>
                  {res.keyword}
                  <XCardText onClick={() => DeleteArray(res.code)}>x</XCardText>
                </SmallCard>
              </>
            );
          })}
        </SmallCardWrapper>
        <BigCardWrapper>
          {techs?.codes
            .filter((datas) => {
              return datas.keyword.toLowerCase().includes(search.toLowerCase());
            })
            .map((res, idx) => {
              const tech = {
                code: res.code,
                keyword: res.keyword,
              };
              return (
                <>
                  <BigCard
                    key={idx}
                    colorBool={!!techList.filter((datas) => datas.code === res.code).length}
                    onClick={() => {
                      CheckArray(tech);
                    }}
                  >
                    {res.keyword}
                  </BigCard>
                </>
              );
            })}
        </BigCardWrapper>
      </Container>
      <Btn
        onClick={() => {
          setArea({ ...area, tech_codes: techList.map((tech) => tech.code) });
          openModal("GATHER_FIELD");
        }}
      >
        완료
      </Btn>
    </>
  );
};

export default TechModal;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 700px;
  height: 48vh;
  margin: 60px 0 20px 0;
  border-radius: 10px;
  background-color: white;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 580px;
`;

const SmallCardWrapper = styled.div`
  display: flex;
  overflow: scroll;
  min-height: 70px;
  gap: 5px;
  padding-left: 10px;
  width: 600px;
  align-items: center;
`;

const SmallCard = styled.button`
  border: none;
  padding: 5px 10px;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  height: 25px;
  display: flex;
  align-items: center;
  margin-right: 7px;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.color.gray90};
  outline: none;
  white-space: nowrap;
  cursor: default;
`;

const XCardText = styled.div`
  margin-left: 7px;
  margin-top: -1px;
  cursor: pointer;
  color: red;
  font-size: 16px;
`;

const SearchIcon = styled(Image)`
  position: absolute;
  top: 0;
  right: 61px;
`;

const ContentsText = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: #7f7f7f;
  margin-top: 8px;
`;

const SearchInput = styled.input`
  background: #eaeaea;
  border: 0.5px solid #f7f7f7;
  border-radius: 30px;
  width: 250px;
  height: 40px;
  outline: none;
  padding: 10px 50px 10px 20px;
`;

const BigCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  height: 300px;
  width: 600px;
  margin-bottom: 20px;
  overflow: scroll;
`;

const BigCard = styled.button<{ colorBool: boolean }>`
  border: none;
  width: 114px;
  height: 76px;
  background-color: ${(props) => (props.colorBool ? "#0F4C82" : "white")};
  color: ${(props) => (props.colorBool ? "white" : "black")};
  font-weight: 350;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  &:hover {
    background-color: ${(props) => !props.colorBool && theme.color.gray40};
    color: ${(props) => (props.colorBool ? "white" : "black")};
  }
  cursor: pointer;
`;

const Btn = styled.button`
  width: 92px;
  height: 40px;
  border: 1px solid #0f4c82;
  border-radius: 3px;
  background-color: white;
  color: #0f4c82;
  cursor: pointer;
  margin-bottom: 55px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 750;
  text-align: start;
`;
