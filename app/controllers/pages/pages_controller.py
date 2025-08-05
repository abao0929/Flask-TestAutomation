from app.extensions import db
from app.models.pages import Page

def add_page(name,url):

    page = Page(
        name = name,
        url = url
    )
    db.session.add(page)
        

    db.session.commit()
    return page

def edit_page(page_id, name, url):
    page = Page.query.get(page_id)
    page.name=name
    page.url=url
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
    pages = Page.query.all()
    return [
            {
                "id": p.id,
                "name": p.name,
                "url": p.url
            }
            for p in pages
        ]
