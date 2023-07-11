export interface IArea {
  job_codes: number[];
  tech_codes: number[];
  hiring: number;
  major_task: string;
}

export type IHiringProgress =
  | "DOCUMENT"
  | "AI"
  | "CODING_TEST"
  | "LIVE_CODING"
  | "TASK"
  | "PERSONALITY"
  | "TECH_INTERVIEW"
  | "CULTURE_INTERVIEW"
  | "FINAL_INTERVIEW"
  | "";

export interface IRecruitment {
  areas: IArea[];
  preferential_treatment: string;
  required_licenses: string[];
  required_grade?: string;
  work_hours: string;
  train_pay: string;
  pay: string;
  benefits: string;
  military_support: boolean;
  hiring_progress: IHiringProgress[];
  submit_document: string;
  start_date: string;
  end_date: string;
  etc: string;
}

export interface IMyRecruitmentResponse extends Omit<IRecruitment, "areas"> {
  recruitment_id: number;
  recruit_year: number;
  areas: {
    job: string;
    tech: string[];
    major_task: string;
    hiring_count: number;
  }[];
}
