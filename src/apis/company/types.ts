export interface ICompanyRegisterRequest {
  name: string;
  founded_at: string;
  representative_name: string;
  main_zip_code: string;
  sub_zip_code?: string;
  main_address: string;
  main_address_detail: string;
  sub_address?: string;
  sub_address_detail?: string;
  take: number;
  worker_number: number;
  company_introduce: string;
  email: string;
  manager_name: string;
  sub_manager_name?: string;
  manager_phone_no: string;
  sub_manager_phone_no?: string;
  fax?: string;
  password: number;
  business_number: string;
  company_profile_url?: string;
  biz_registration_url: string;
  business_area_code: number;
  service_name: string;
  attachment_urls?: string[] | null;
}

export interface ICheckBuisnessNumberResponse {
  company_name: string;
  exists: boolean;
}

export interface IMyCompanyResponse {
  name: string;
  biz_no: string;
  type: string;
  main_address: string;
  main_zip_code: string;
  sub_address: string;
  sub_zip_code?: string;
  representative: string;
  founded_at: string;
  sales_per_year: number;
  workers_count: number;
  manager_name: string;
  manager_phone_no: string;
  sub_manager_name?: string;
  sub_manager_phone_no?: string;
  fax?: string;
  email: string;
  company_introduce: string;
  company_logo_url: string;
  service_name: string;
  business_area: string;
  biz_registration_url: string;
}
