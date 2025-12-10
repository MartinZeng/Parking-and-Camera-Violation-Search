export interface Violation {
  plate: string;
  state: string;
  license_type: string;
  summons_number: number;
  issue_date: string;
  violation_time: string;
  violation: string;
  judgment_entry_date: string;
  fine_amount: number;
  penalty_amount: number;
  interest_amount: number;
  reduction_amount: number;
  payment_amount: number;
  amount_due: number;
  precinct: number;
  county: string;
  issuing_agency: string;
  violation_status: string;
}
