from flask import Blueprint, request, redirect, url_for, flash, jsonify
from app.models.pages import Page
from app.extensions import db

page_view = Blueprint('page_view', __name__)

def is_ajax():
    return request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes.best == 'application/json'

@page_view.route('/page/add', methods=['POST'])
def add_page():
    name = request.form.get('name', '').strip()
    url_ = request.form.get('url', '').strip()
    if not name:
        msg = "页面名不能为空"
        status = "danger"
        success = False
    elif Page.query.filter(db.func.lower(Page.name) == name.lower()).first():
        msg = "页面已存在"
        status = "warning"
        success = False
    else:
        page = Page(name=name, url=url_)
        db.session.add(page)
        db.session.commit()
        msg = "添加页面成功"
        status = "success"
        success = True

    if is_ajax():
        return jsonify({'success': success, 'msg': msg, 'status': status})
    else:
        flash(msg, status)
        return redirect(url_for('locator_view.locator_management'))

@page_view.route('/page/edit/<int:page_id>', methods=['POST'])
def edit_page(page_id):
    page = Page.query.get(page_id)
    if not page:
        if is_ajax():
            return jsonify({'success': False, 'msg': "Not Found"}), 404
        return "Not Found", 404

    page.name = request.form.get('name', page.name)
    page.url = request.form.get('url', page.url)
    db.session.commit()
    msg = "修改页面成功"

    if is_ajax():
        return jsonify({'success': True, 'msg': msg})
    else:
        flash(msg, "success")
        return redirect(url_for('locator_view.locator_management'))

@page_view.route('/page/delete/<int:page_id>', methods=['POST'])
def delete_page(page_id):
    page = Page.query.get(page_id)
    if not page:
        msg = "页面未找到"
        status = "warning"
        success = False
    else:
        db.session.delete(page)
        db.session.commit()
        msg = "删除页面成功"
        status = "success"
        success = True

    if is_ajax():
        return jsonify({'success': success, 'msg': msg, 'status': status})
    else:
        flash(msg, status)
        return redirect(url_for('locator_view.locator_management'))
