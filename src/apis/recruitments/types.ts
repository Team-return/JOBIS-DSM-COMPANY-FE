export interface IArea {
  id?: number;
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
  military: boolean;
  hiring_progress: IHiringProgress[];
  submit_document?: string;
  start_date: string;
  end_date: string;
  etc: string;
}

export interface IEditRecruitmentRequest extends Omit<IRecruitment, "areas" | "military_support"> {
  military: boolean;
}

export interface IMyRecruitmentResponse extends Omit<IRecruitment, "areas"> {
  recruitment_id: number;
  recruit_year: number;
  areas: {
    id?: number;
    job: string[];
    tech: string[];
    major_task: string;
    hiring: number;
  }[];
  company_name: string;
  company_profile_url: string;
}
