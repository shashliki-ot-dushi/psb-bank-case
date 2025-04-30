from pathlib import Path
from typing import Dict, Any
from functools import lru_cache

import pandas as pd


class CompanyNotFoundError(ValueError):
    """ИНН не найден в источнике."""


class CompanyStatsSource:
    """
    Базовый интерфейс получения статистики по категориям.
    """

    CATEGORY_FIELDS: Dict[str, list[str]] = {
        "general": [
            "inn", "num_employees", "company_age_years", "msp_category",
            "main_okved", "main_okved2", "region2", "num_founders",
            "has_mass_founder", "has_prev_entity", "ust_kap"
        ],
        "financial": [
            # Основные показатели
            *[f for f in []],  # placeholder to allow list expansion
            # Финансовые метрики из CSV
            "fin_rev_last", "fin_rev_cagr_3y", "fin_assets_last",
            "fin_gross_margin", "fin_profit_margin", "fin_ebitda_margin",
            "fin_net_profit_3y_mean", "fin_equity_ratio", "fin_loss_years_cnt",
            "fin_debt_short", "fin_debt_long", "fin_net_debt",
            "fin_debt_ebitda", "fin_current_ratio", "fin_cashflow_oper",
            "fin_cf_op_to_debt", "fin_equity_negative_flag", "fin_last_year",
            "fin_years_cnt", "fin_ebitda_est",
            # Дополнительные коэффициенты
            "debt_to_assets", "debt_to_equity", "rev_per_employee",
            "asset_turnover", "roa", "roe", "net_debt_to_ebitda",
            "oper_cf_to_debt", "tax_arrears_rate", "rev_cagr_3y",
            "assets_cagr_3y", "employ_diff", "fssp_decay",
            # Бины и логи
            "age_bin", "emp_bin", "log1p_fin_rev_last",
            "log1p_fin_assets_last", "log1p_total_debt",
            "log1p_fin_cashflow_oper", "log1p_tax_arrears", "log1p_sum_price_total"
        ],
        "contracts": [
            "cnt_contracts_total", "cnt_44fz", "cnt_94fz", "cnt_223fz",
            "sum_price_total", "avg_price", "median_price",
            "last_contract_days_ago", "first_contract_age",
            "uniq_customers", "top_customer_share", "uniq_regions",
            "share_not_executed", "sum_active_price", "has_large_contract",
            "obj_codes_cnt", "share_223fz"
        ],
        "arbitration": [
            "arb_cases_total", "arb_claims_sum_total", "arb_avg_claim",
            "arb_max_claim", "arb_cases_plaintiff", "arb_cases_defendant",
            "arb_claims_sum_defendant", "arb_open_cases_cnt",
            "arb_last_case_days_ago", "arb_cases_last_12m",
            "arb_unique_opponents", "arb_tax_authority_flag",
            "arb_multistage_share", "arb_large_case_flag",
            "arb_dispute_code_mode"
        ],
        "enforcement": [
            "enf_cases_total", "enf_debt_sum_total", "enf_debt_outstanding",
            "enf_avg_outstanding", "enf_max_outstanding", "enf_paid_share",
            "enf_tax_cnt", "enf_credit_cnt", "enf_other_cnt",
            "enf_large_flag", "enf_active_cnt",
            "enf_last_proc_days_ago", "enf_first_proc_age",
            "enf_regions_cnt", "enf_fssp_units_cnt", "paid_enf_ratio"
        ],
        "risk": [
            "tax_paid_total", "tax_arrears", "has_sanctions", "has_efrsb",
            "illegal_finance", "mass_address", "mass_director",
            "has_mass_founder"
        ],
    }

    def get_category_stats(self, inn: str, category: str) -> Dict[str, Any]:
        raise NotImplementedError

    def get_financial_stats(self, inn: str) -> Dict[str, Any]:
        return self.get_category_stats(inn, "financial")

    def get_general_stats(self, inn: str) -> Dict[str, Any]:
        return self.get_category_stats(inn, "general")

    def get_contracts_stats(self, inn: str) -> Dict[str, Any]:
        return self.get_category_stats(inn, "contracts")

    def get_arbitration_stats(self, inn: str) -> Dict[str, Any]:
        return self.get_category_stats(inn, "arbitration")

    def get_enforcement_stats(self, inn: str) -> Dict[str, Any]:
        return self.get_category_stats(inn, "enforcement")

    def get_risk_stats(self, inn: str) -> Dict[str, Any]:
        return self.get_category_stats(inn, "risk")

    def get_all_stats(self, inn: str) -> Dict[str, Dict[str, Any]]:
        return {cat: self.get_category_stats(inn, cat)
                for cat in self.CATEGORY_FIELDS}


class CompanyStatsFromLocal(CompanyStatsSource):
    def __init__(self, csv_path: str | Path = "company_info.csv") -> None:
        path = Path(csv_path).expanduser()

        if not path.is_file():
            raise FileNotFoundError(f"CSV не найден: {csv_path}")

        self._df = pd.read_csv(path)
        self._df["inn"] = self._df["inn"].astype(str).str.strip()

    @lru_cache(maxsize=1024)
    def get_row(self, inn: str) -> pd.Series:
        normalized_inn = inn.strip()
        matches = self._df[self._df["inn"] == normalized_inn]

        if matches.empty:
            raise CompanyNotFoundError(f"Компания с ИНН {inn} не найдена")

        return matches.iloc[0]

    def get_category_stats(self, inn: str, category: str) -> Dict[str, Any]:
        if category not in self.CATEGORY_FIELDS:
            raise KeyError(f"Unknown category: {category}")

        row = self.get_row(inn)
        fields = self.CATEGORY_FIELDS[category]
        subset = row.reindex(fields)

        return {
            col: None if pd.isna(val) else (val.item() if hasattr(val, "item") else val)
            for col, val in subset.items()
        }


class CompanyStatsFromWeb(CompanyStatsSource):
    def get_category_stats(self, inn: str, category: str) -> Dict[str, Any]:
        raise NotImplementedError("Parsing the web is not yet ready")
