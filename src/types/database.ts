export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}

export type Contract = {
  id: string;
  name: string;
  description: string | null;
  terms: string;
  amount: number;
  training_items: string[];
  manual_count: number;
  special_notes: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export type Application = {
  id: string;
  contract_id: string;
  applicant_id: string;
  sales_rep_id: string | null;
  contact_name: string;
  contact_email: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  company_name: string;
  company_address: string;
  representative_name: string;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  contracts?: Contract;
}

export type Signature = {
  id: string;
  application_id: string;
  signature_data: string;
  signed_at: string;
  signed_by: string;
  email_sent: boolean;
  email_sent_at: string | null;
  pdf_url: string | null;
  created_at: string;
}

export type ApplicationFormData = Omit<Application, 
  'id' | 'applicant_id' | 'sales_rep_id' | 'status' | 
  'created_at' | 'updated_at' | 'submitted_at' | 'approved_at'
>;

export type ContractFormData = {
  initial_cost: number;
  monthly_cost: number;
  additional_options: number;
  training_items: string[];
  special_notes: string;
};