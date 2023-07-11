import styled from "styled-components";
import FileIcon from "../../../public/file.svg";
import XBtn from "../../../public/X.svg";
import Image from "next/image";
import React, { SetStateAction } from "react";
import { IFiles } from "../Auth/Register";
import { ICompanyRegisterRequest } from "@/apis/company/types";

interface Type {
  name?: string;
  fileName: string;
  size: number;
  id: number;
  multiple?: boolean;
  setFiles: React.Dispatch<SetStateAction<IFiles>>;
  setForm: React.Dispatch<SetStateAction<ICompanyRegisterRequest>>;
  onDeleteFile: () => void;
}

export function Files({ fileName, name, size, id, multiple, setFiles, setForm, onDeleteFile }: Type) {
  const deleteFile = () => {
    setFiles((prev) => ({ ...prev, [name as string]: prev[name as keyof IFiles].filter((_, idx) => idx !== id) }));
    if (multiple) {
      setForm((prev) => ({
        ...prev,
        [name + "_urls"]: prev.attachment_urls?.filter((_, i) => id !== i),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name + "_url"]: "" }));
      onDeleteFile();
    }
  };

  return (
    <File>
      <FileBox>
        <Image src={FileIcon} alt="" width={13} unoptimized />
        <FileName title={fileName}>{fileName}</FileName>
        <Size>{(size / 1024.0).toFixed(2) + "KB"}</Size>
      </FileBox>
      <DelBtn onClick={deleteFile}>
        <Image alt="x" src={XBtn} width={15} unoptimized />
      </DelBtn>
    </File>
  );
}

const File = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileName = styled.div`
  max-width: 310px;
  height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  cursor: default;
`;

const DelBtn = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  cursor: pointer;
`;

const Size = styled.p`
  color: #7f7f7f;
`;

const FileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  font-size: 15px;
`;

export default Files;
