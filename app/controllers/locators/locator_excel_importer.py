import os
import pandas as pd
from app.models.locators import Locator, LocatorMethod, LocatorOperate
from app.extensions import db

def import_locators_from_excel(filepath):
    """
    从给定Excel文件读取Locators sheet并批量入库，返回(success, msg)
    """
    try:
        df = pd.read_excel(filepath, sheet_name="Locators")
        expected_columns = {"name", "method", "value", "page", "operate"}
        actual_columns = set(df.columns.str.lower())
        if actual_columns != expected_columns:
            return False, f"表结构有误，必须包含列：{expected_columns}"

        imported, skipped = 0, 0
        for _, row in df.iterrows():
            name = row["name"]
            method_str = row["method"]
            value = row["value"]
            page = row["page"]
            operate_str = row["operate"]

            try:
                method = LocatorMethod[method_str]
            except KeyError:
                skipped += 1
                continue

            try:
                operate = LocatorOperate[operate_str]
            except KeyError:
                skipped += 1
                continue

            locator = Locator(
                name=name,
                method=method,
                value=value,
                page=page,
                operate=operate
            )
            db.session.add(locator)
            imported += 1

        db.session.commit()
        return True, f"Excel 导入成功，成功 {imported} 条，跳过 {skipped} 条"
    except Exception as e:
        return False, f"导入失败：{str(e)}"
