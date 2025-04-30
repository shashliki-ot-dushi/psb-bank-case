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
            "num_employees", "company_age_years", "main_okved", "main_okved2",
            "msp_category", "has_prev_entity"
        ],
        "financial": [
            # 1.1 Ликвидность
            "fin_current_ratio", "fin_cashflow_oper", "fin_cf_op_to_debt",
            
            # 1.2 Рентабельность
            "fin_profit_margin", "fin_gross_margin", "fin_ebitda_margin",
            "fin_net_profit_3y_mean",
            
            # 1.3 Долговая нагрузка
            "fin_debt_short", "fin_debt_long", "fin_net_debt", "fin_debt_ebitda",
            
            # 1.4 Отчётность
            "fin_rev_last", "fin_assets_last", "fin_last_year",
            "fin_equity_negative_flag"
        ],
        "contracts": [
            "cnt_44fz", "has_large_contract", "uniq_customers",
            "top_customer_share", "sum_price_total", "sum_active_price"
        ],
        "arbitration": [
            "arb_claims_sum_total", "arb_cases_last_12m", "arb_open_cases_cnt",
            "arb_cases_defendant", "arb_large_case_flag"
        ],
        "enforcement": [
            "enf_cases_total", "enf_credit_cnt", "enf_debt_sum_total",
            "enf_paid_share", "enf_large_flag"
        ],
        "risk": [
            "tax_paid_total", "tax_arrears", "has_sanctions",
            "has_efrsb", "mass_address", "has_mass_founder"
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
        self._df["inn"] = self._df["inn"].astype(str).str.strip()  # унификация

    @lru_cache(maxsize=1024)
    def get_row(self, inn: str) -> pd.Series:
        """
        Возвращает строку из DataFrame по ИНН. Кэширует результат.
        """
        normalized_inn = inn.strip()
        matches = self._df[self._df["inn"] == normalized_inn]

        if matches.empty:
            raise CompanyNotFoundError(f"Компания с ИНН {inn} не найдена")

        return matches.iloc[0]

    def get_category_stats(self, inn: str, category: str) -> Dict[str, Any]:
        if category not in CompanyStatsSource.CATEGORY_FIELDS:
            raise KeyError(f"Unknown category: {category}")

        row = self.get_row(inn)
        fields = CompanyStatsSource.CATEGORY_FIELDS[category]
        subset = row.reindex(fields)

        return {
            col: None if pd.isna(val) else (val.item() if hasattr(val, "item") else val)
            for col, val in subset.items()
        }


class CompanyStatsFromWeb(CompanyStatsSource):
    def get_category_stats(self, inn: str, category: str) -> Dict[str, Any]:
        raise NotImplementedError("Parsing the web is not yet ready")
