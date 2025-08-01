from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from werkzeug.utils import secure_filename
import os
from app.models.pages import Page
from app.controllers.locators.locators_controller import (
    save_locator,
    get_locator_by_id,
    delete_locator,
)
from app.models.locators import Locator, LocatorMethod, LocatorOperate
from app.extensions import db
from app.controllers.locators.locator_excel_importer import import_locators_from_excel

locator_view = Blueprint("locator_view", __name__)

@locator_view.route("/locator", methods=["GET"])
def locator_management():
    page = request.args.get('page', 1, type=int)
    pagination = Locator.query.paginate(page=page, per_page=50)
    locators = pagination.items
    pages = Page.query.all()
    return render_template(
        "locator_management.html",
        locators=locators,
        methods=LocatorMethod,
        pages=pages,
        operates=LocatorOperate,
        pagination=pagination
    )

@locator_view.route("/locator/create", methods=["POST"])
def create_locator():
    name = request.form.get("name")
    method = request.form.get("method")
    value = request.form.get("value")
    page_ = request.form.get("page")
    operate = request.form.get("operate")
    try:
        save_locator(name, method, value, page_, operate)
        flash("添加成功", "success")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for("locator_view.locator_management"))

@locator_view.route("/locator/delete/<int:locator_id>", methods=["POST"])
def delete_locator_route(locator_id):
    if delete_locator(locator_id):
        flash("删除成功", "success")
    else:
        flash("未找到要删除的项", "warning")
    return redirect(url_for("locator_view.locator_management"))

@locator_view.route("/locator/edit/<int:locator_id>", methods=["POST"])
def edit_locator_modal(locator_id):
    name = request.form.get("name")
    method = request.form.get("method")
    value = request.form.get("value")
    page_ = request.form.get("page")
    operate = request.form.get("operate")
    try:
        save_locator(name, method, value, page_, operate, locator_id)
        flash("修改成功", "success")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for("locator_view.locator_management"))

@locator_view.route("/locator/upload", methods=["POST"])
def upload_excel():
    file = request.files.get("excel_file")
    if not file:
        flash("No file uploaded", "danger")
        return redirect(url_for("locator_view.locator_management"))

    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    success, msg = import_locators_from_excel(filepath)
    flash(msg, "success" if success else "danger")
    return redirect(url_for("locator_view.locator_management"))

@locator_view.route('/locator/list')
def locator_list_partial():
    page = request.args.get('page', 1, type=int)
    per_page = 50
    pagination = Locator.query.paginate(page=page, per_page=per_page)
    locators = pagination.items
    return render_template(
        'locator_list_partial.html', 
        locators=locators, 
        pagination=pagination
    )

