from flask import Blueprint, request, jsonify, current_app
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

locator_api = Blueprint("locator_api", __name__, url_prefix="/api/locator")

# 1. 获取列表（分页）
@locator_api.route("", methods=["GET"])
def locator_list():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    pagination = Locator.query.paginate(page=page, per_page=per_page)
    locators = [{
        "id": l.id,
        "name": l.name,
        "method": l.method.value,
        "value": l.value,
        "page": l.page,
        "operate": l.operate.value
    } for l in pagination.items]
    return jsonify({
        "locators": locators,
        "total": pagination.total,
        "page": page,
        "per_page": per_page
    })

# 2. 新增
@locator_api.route("", methods=["POST"])
def create_locator():
    data = request.json
    try:
        save_locator(
            data["name"], data["method"], data["value"],
            data["page"], data["operate"]
        )
        return jsonify({"success": True, "msg": "添加成功"}), 201
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)}), 400

# 3. 删除
@locator_api.route("/<int:locator_id>", methods=["DELETE"])
def delete_locator_route(locator_id):
    if delete_locator(locator_id):
        return jsonify({"success": True, "msg": "删除成功"})
    else:
        return jsonify({"success": False, "msg": "未找到要删除的项"}), 404

# 4. 编辑
@locator_api.route("/<int:locator_id>", methods=["PUT"])
def edit_locator(locator_id):
    data = request.json
    try:
        save_locator(
            data["name"], data["method"], data["value"],
            data["page"], data["operate"], locator_id
        )
        return jsonify({"success": True, "msg": "修改成功"})
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)}), 400

# 5. 上传 Excel
@locator_api.route("/upload", methods=["POST"])
def upload_excel():
    file = request.files.get("excel_file")
    if not file:
        return jsonify({"success": False, "msg": "No file uploaded"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    success, msg = import_locators_from_excel(filepath)
    return jsonify({"success": success, "msg": msg}), (200 if success else 400)

# 6. 获取常量选项（方法、页面、操作类型等）
@locator_api.route("/meta", methods=["GET"])
def locator_meta():
    methods = [m.value for m in LocatorMethod]
    operates = [o.value for o in LocatorOperate]
    pages = [p.name for p in Page.query.all()]
    return jsonify({
        "methods": methods,
        "operates": operates,
        "pages": pages
    })
