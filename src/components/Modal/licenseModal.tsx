import { IRecruitment } from "@/apis/recruitments/types";
import { Button, HStack, Input } from "@team-return/design-system";
import React, { Dispatch, SetStateAction, useState } from "react";

interface PropsType {
  setForm: Dispatch<SetStateAction<IRecruitment>>;
}

const LicenseModal = ({ setForm }: PropsType) => {
  const [license, setLicense] = useState("");

  const Search = () => {
    setForm((prev) => ({ ...prev, required_licenses: [...prev.required_licenses, license] }));
    setLicense("");
  };

  return (
    <>
      <HStack justify="center" align="center" height={200}>
        <Input
          placeHolder="자격증을 입력해주세요"
          width={50}
          value={license}
          onChange={(e) => {
            setLicense(e.target.value);
          }}
        />
        <Button onClick={Search}>완료</Button>
      </HStack>
    </>
  );
};

export default LicenseModal;
