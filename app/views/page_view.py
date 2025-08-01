from flask import Blueprint, request, redirect, url_for, flash
from app.models.pages import Page
from app.extensions import db

page_view = Blueprint('page_view', __name__)

@page_view.route('/page/add', methods=['POST'])
def add_page():
    name = request.form.get('name').strip()
    url = request.form.get('url', '').strip()
    if not name:
        flash("页面名不能为空", "danger")
    elif Page.query.filter(db.func.lower(Page.name) == name.lower()).first():
        flash("页面已存在", "warning")
    else:
        page = Page(name=name, url=url)
        db.session.add(page)
        db.session.commit()
        flash("添加页面成功", "success")
    return redirect(url_for('locator_view.locator_management'))

@page_view.route('/page/edit/<int:page_id>', methods=['POST'])
def edit_page(page_id):
    page = Page.query.get(page_id)
    if not page:
        return "Not Found", 404
    page.name = request.form.get('name')
    page.url = request.form.get('url')
    db.session.commit()
    # 支持AJAX无需重定向
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return '', 204
    flash("修改页面成功", "success")
    return redirect(url_for('locator_view.locator_management'))


@page_view.route('/page/delete/<int:page_id>', methods=['POST'])
def delete_page(page_id):
    page = Page.query.get(page_id)
    if not page:
        flash("页面未找到", "warning")
    else:
        db.session.delete(page)
        db.session.commit()
        flash("删除页面成功", "success")
    return redirect(url_for('locator_view.locator_management'))

