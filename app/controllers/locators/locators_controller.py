from app.extensions import db
from app.models.locators import Locator, LocatorMethod, LocatorOperate
from app.models.pages import Page

def save_locator(name, method, value, page, operate, locator_id=None):
    """
    新建或更新一个 locator。
    如果 locator_id 为 None，则新建；否则更新指定 id 的 locator。
    返回 locator 实例。
    """

    valid_pages = {p.name for p in Page.query.all()}
    if page not in valid_pages:
        raise ValueError(f"页面 {page} 不存在，请先在 Pages 表中创建。")
    

    # 枚举校验
    try:
        method_enum = LocatorMethod[method]
    except KeyError:
        raise ValueError(f"Invalid method: {method}")

    try:
        operate_enum = LocatorOperate[operate]
    except KeyError:
        raise ValueError(f"Invalid operate: {operate}")
    
    

    if locator_id is None:
        locator = Locator(
            name=name,
            method=method_enum,
            value=value,
            page=page,
            operate=operate_enum
        )
        db.session.add(locator)
    else:
        locator = Locator.query.get(locator_id)
        if not locator:
            raise ValueError("Locator not found")
        locator.name = name
        locator.method = method_enum
        locator.value = value
        locator.page = page
        locator.operate = operate_enum

    db.session.commit()
    return locator

def get_locator_by_id(locator_id):
    return Locator.query.get(locator_id)

def delete_locator(locator_id):
    locator = Locator.query.get(locator_id)
    if locator:
        db.session.delete(locator)
        db.session.commit()
        return True
    return False

def get_all_locators():
    return Locator.query.all()
