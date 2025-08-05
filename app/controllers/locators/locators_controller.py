from app.extensions import db
from app.models.locators import Locator, LocatorMethod, LocatorOperate
from app.models.pages import Page

# 添加locator
def add_locator(name, method, value, page, operate):
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
    
    locator = Locator(
        name=name,
        method=method_enum,
        value=value,
        page=page,
        operate=operate_enum
    )
    db.session.add(locator)
    db.session.commit()
    return locator

# 编辑locator
def edit_locator(locator_id, name, method, value, page, operate):
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
    
    locator = Locator.query.get(locator_id)
    locator.name = name
    locator.method = method
    locator.value = value
    locator.page = page
    locator.operate = operate

    db.session.commit()
    return locator

# 根据id获取locator
def get_locator_by_id(locator_id):
    return Locator.query.get(locator_id)

# 删除locator
def delete_locator(locator_id):
    locator = Locator.query.get(locator_id)
    if locator:
        db.session.delete(locator)
        db.session.commit()
        return True
    return False

# 获取所有的locator
def get_all_locators():
    locators = Locator.query.all()
    return [
            {
                "id": l.id,
                "name": l.name,
                "method": l.method.value,
                "value": l.value,
                "page": l.page,
                "operate": l.operate.value
            }
            for l in locators
        ]

# 获取所有的method
def get_all_methods():
    # 返回所有 method 的名字和值
    return [{"name": m.name, "value": m.value} for m in LocatorMethod]


# 获取所有的operate
def get_all_operates():
    return [{"name": o.name, "value": o.value} for o in LocatorOperate]