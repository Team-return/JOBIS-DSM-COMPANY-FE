import { styled } from "styled-components";
import React, { ChangeEvent, ReactNode, SetStateAction, useCallback, useRef } from "react";
import { VStack } from "@team-return/design-system";
import Files from "./File";
import { IFiles } from "../Auth/Register";
import { ICompanyRegisterRequest } from "@/apis/company/types";

interface InputProps {
  title?: string;
  required?: boolean;
  name?: string;
  button?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
}

interface LineInputProps extends InputProps {
  unit?: string;
  maxLength?: number;
  value?: string | number | null;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface FileInputProps extends InputProps {
  messages?: string[];
  multiple?: boolean;
  files: File[];
  setFiles: React.Dispatch<SetStateAction<IFiles>>;
  setForm: React.Dispatch<SetStateAction<ICompanyRegisterRequest>>;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// TODO INPUT 분리하기
export const Input = ({
  title,
  required,
  name,
  value,
  onChange,
  placeholder,
  button,
  disabled,
  maxLength,
  unit,
}: LineInputProps) => {
  return (
    <InputContainer>
      {title && (
        <InputTitle>
          {title}
          {required && <BlueStar>*</BlueStar>}
        </InputTitle>
      )}
      <EndWrapper>
        <LineInput
          maxLength={maxLength}
          disabled={disabled}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
        />
        <UnitText>{unit}</UnitText>
        {!!button && button}
      </EndWrapper>
    </InputContainer>
  );
};

export const TextArea = ({ title, required, name, value, onChange, placeholder, maxLength }: LineInputProps) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const handleResizeHeight = useCallback(() => {
    if (textRef && textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, []);

  return (
    <InputContainer>
      {title && (
        <InputTitle>
          {title}
          {required && <BlueStar>*</BlueStar>}
        </InputTitle>
      )}
      <EndWrapper>
        <LineTextArea
          ref={textRef}
          rows={1}
          name={name}
          value={value ?? ""}
          onInput={handleResizeHeight}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </EndWrapper>
    </InputContainer>
  );
};

export const FileInput = ({
  setForm,
  title,
  required,
  name,
  messages,
  multiple,
  files,
  onUploadImage,
  setFiles,
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  const onDeleteFile = () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
  };

  return (
    <InputContainer>
      {title && (
        <InputTitle>
          {title}
          {required && <BlueStar>*</BlueStar>}
        </InputTitle>
      )}
      <EndWrapper>
        <FileWrapper>
          <FileArea>
            {files?.map((file, idx) => (
              <Files
                key={idx}
                name={name}
                fileName={file.name}
                id={idx}
                size={file.size}
                multiple={multiple}
                setFiles={setFiles}
                setForm={setForm}
                onDeleteFile={onDeleteFile}
              />
            ))}
          </FileArea>
          <Messages>
            <VStack gap={10}>
              {messages?.map((message, idx) => {
                return <Message key={idx}>{message}</Message>;
              })}
            </VStack>
            <SearchButton onClick={onUploadImageButtonClick}>파일추가</SearchButton>
            <input
              name={name}
              style={{ display: "none" }}
              multiple={multiple}
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={onUploadImage}
            />
          </Messages>
        </FileWrapper>
      </EndWrapper>
    </InputContainer>
  );
};

export const CustomInput = ({ title, required, children }: InputProps) => {
  return (
    <InputContainer>
      {title && (
        <InputTitle>
          {title}
          {required && <BlueStar>*</BlueStar>}
        </InputTitle>
      )}
      <EndWrapper>{children}</EndWrapper>
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  width: 100%;
  min-height: 45px;
  padding-bottom: 30px;
`;

const InputTitle = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 350;
  margin-top: 15px;
  white-space: nowrap;
`;

const BlueStar = styled.div`
  font-size: 16px;
  color: #0087ff;
  margin-left: 2px;
`;

const EndWrapper = styled.div`
  position: relative;
  display: flex;
  margin-left: auto;
  max-width: 500px;
  width: 80%;
  min-height: 45px;
`;

const UnitText = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
`;

const LineInput = styled.input<{ disabled?: boolean }>`
  width: 100%;
  height: 45px;
  padding: 10px 15px;
  border: 0;
  outline: 0;
  margin-left: auto;
  border-bottom: 1px solid #cccccc;
  font-size: 16px;
  font-weight: 400;
  &::placeholder {
    color: #7f7f7f;
  }
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "auto")};
`;

const LineTextArea = styled.textarea`
  width: 100%;
  min-height: 55px;
  border: 0;
  outline: 0;
  border-bottom: 1px solid #cccccc;
  resize: none;
  margin: 15px 0 0 0;
  padding: 0 0 10px 5px;
  &::placeholder {
    color: #7f7f7f;
  }
`;

const FileArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 45px;
  padding: 16px;
  margin-left: auto;
  font-size: 14px;
  font-weight: 350;
  background-color: #efefef;
  gap: 10px;
`;

const FileWrapper = styled.div`
  width: 100%;
`;

const Message = styled.li`
  margin: 0;
  white-space: pre-line;
`;

const Messages = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 23px;
  color: #7f7f7f;
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 91px;
  height: 45px;
  padding: 15px;
  border: 1.5px solid #0f4c82;
  font-size: 13px;
  border-radius: 3px;
  color: #0f4c82;
  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;
