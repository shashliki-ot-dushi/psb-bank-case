export interface FeatureItem {
  name: string
  value: number
  error?: number
}

export interface GeneralStats {
  num_employees: number
  company_age_years: number
  main_okved: string
  main_okved2: number
  msp_category: string | number
  has_prev_entity: number
}

export interface FinancialStats {
  fin_current_ratio: number
  fin_cashflow_oper: number
  fin_cf_op_to_debt: number | null
  fin_profit_margin: number
  fin_gross_margin: number
  fin_ebitda_margin: number
  fin_net_profit_3y_mean: number
  fin_debt_short: number
  fin_debt_long: number | null
  fin_net_debt: number | null
  fin_debt_ebitda: number | null
  fin_rev_last: number
  fin_assets_last: number
  fin_last_year: number
  fin_equity_negative_flag: number
}

export interface ContractsStats {
  cnt_44fz: number
  has_large_contract: number
  uniq_customers: number
  top_customer_share: number
  sum_price_total: number
  sum_active_price: number
}

export interface ArbitrationStats {
  arb_claims_sum_total: number
  arb_cases_last_12m: number
  arb_open_cases_cnt: number
  arb_cases_defendant: number
  arb_large_case_flag: number
}

export interface EnforcementStats {
  enf_cases_total: number
  enf_credit_cnt: number
  enf_debt_sum_total: number
  enf_paid_share: number | null
  enf_large_flag: number
}

export interface RiskStats {
  tax_paid_total: number
  tax_arrears: number
  has_sanctions: number
  has_efrsb: number
  mass_address: number
  has_mass_founder: number
}

export interface CompanyData {
  id: string
  name: string
  taxId: string
  approved: boolean
  creditScore: number
  featureImportance: FeatureItem[]
  featureImpact: FeatureItem[]
  globalImportance: FeatureItem[]
  general: GeneralStats
  financial: FinancialStats
  contracts: ContractsStats
  arbitration: ArbitrationStats
  enforcement: EnforcementStats
  risk: RiskStats
}

export async function getCompanyData(inn: string): Promise<CompanyData & { statsAll: any }> {
  const [analyzeRes, statsRes] = await Promise.all([
    fetch(`http://localhost:8000/v1/analyze/?inn=${encodeURIComponent(inn)}`, { cache: "no-store" }),
    fetch(`http://localhost:8000/v1/stats/all/?inn=${encodeURIComponent(inn)}`, { cache: "no-store" }),
  ])

  if (!analyzeRes.ok) {
    throw new Error(`Failed to load company data (${analyzeRes.status})`)
  }

  if (!statsRes.ok) {
    throw new Error(`Failed to load stats data (${statsRes.status})`)
  }

  const analyzeData = await analyzeRes.json()
  const statsData = await statsRes.json()

  return {
    ...analyzeData,
    statsAll: statsData
  }
}