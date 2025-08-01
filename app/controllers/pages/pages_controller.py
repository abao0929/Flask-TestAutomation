from app.extensions import db
from app.models.pages import Page

def save_page(name,url, page_id=None):
    """
    新建或更新一个 page。
    如果 page 为 None，则新建；否则更新指定 id 的 page。
    返回 page 实例。
    """

    if page_id is None:
        page = Page(
            name=name,
            url = url
        )
        db.session.add(page)
    else:
        page = Page.query.get(page_id)
        if not page:
            raise ValueError("page not found")
        page.name = name
        page.url = url
        

    db.session.commit()
    return page

def get_page_by_id(page_id):
    return Page.query.get(page_id)

def delete_page(page_id):
    page = Page.query.get(page_id)
    if page:
        db.session.delete(page)
        db.session.commit()
        return True
    return False

def get_all_pages():
    return Page.query.all()
