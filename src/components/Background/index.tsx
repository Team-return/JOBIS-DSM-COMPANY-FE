import styled, { keyframes } from "styled-components";
import BlueCircleImg from "../../../public/BlueCircle.png";
import SmallBlue from "../../../public/SmallBlue.png";
import Image from "next/image";

const Background = () => {
  return (
    <>
      <BlueBigImg
        style={{ position: "absolute", top: "-15vw", left: "-10vw", zIndex: 1 }}
        src={BlueCircleImg}
        rotatetrue={10}
        rotatefalse={-180}
        alt="파란 큰원"
      />
      <SmallCircle
        style={{ position: "absolute", top: "20vw", left: "-16vw", zIndex: 0 }}
        src={SmallBlue}
        rotatetrue={170}
        rotatefalse={-20}
        alt="파란 작은원"
      />
      <BlueBigImg
        style={{ position: "absolute", top: "4vw", right: "-35vw", zIndex: 1 }}
        src={BlueCircleImg}
        rotatetrue={130}
        rotatefalse={-50}
        alt="파란 큰원"
      />
      <SmallCircle
        style={{ position: "absolute", top: "35vw", right: "-6vw", zIndex: 0 }}
        src={SmallBlue}
        rotatetrue={95}
        rotatefalse={-150}
        alt="파란 작은원"
      />
    </>
  );
};

export default Background;

const BlueBigImg = styled(Image)<{ rotatetrue: number; rotatefalse: number }>`
  width: 50vw;
  height: 50vw;
  transform: rotate(${({ rotatetrue }) => rotatetrue}deg);
  animation: ${({ rotatetrue, rotatefalse }) => rotateCircle(rotatefalse, rotatetrue)} 1s ease-in-out;
`;

const SmallCircle = styled(Image)<{ rotatetrue: number; rotatefalse: number }>`
  width: 30vw;
  height: 30vw;
  transform: rotate(${({ rotatetrue }) => rotatetrue}deg);
  animation: ${({ rotatetrue, rotatefalse }) => rotateCircle(rotatefalse, rotatetrue)} 1s ease-in-out;
`;

const rotateCircle = (rotatefalse: number, rotatetrue: number) => keyframes`
  from {
    transform: rotate(${rotatefalse}deg);
  }
  to {
    transform: rotate(${rotatetrue}deg);
  }
`;
