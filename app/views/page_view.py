from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from app.models.pages import Page
from app.controllers.pages.pages_controller import (
    add_page,
    edit_page,
    get_page_by_id,
    delete_page,
    get_all_pages,
)
from app.models.locators import Locator, LocatorMethod, LocatorOperate
from app.extensions import db

page_api = Blueprint("page_api", __name__, url_prefix="/api/page")

# 1. 获取locator列表
@page_api.route("", methods=["GET"])
def locator_list():
    data = get_all_pages()
    return jsonify(data)
    

# 2. 新增
@page_api.route("/add", methods=["POST"])
def create_locator():
    data = request.json
    try:
        add_page(
            data["name"], data["url"]
        )
        return jsonify({"success": True, "msg": "添加成功"})
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)})

# 编辑
@page_api.route("/edit/<int:id>", methods=["PUT"])
def edit_record(id):
    data = request.json
    try:
        edit_page(
            id,
            data["name"], data["url"]
        )
        return jsonify({"success": True, "msg": "编辑成功"})
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)})
    
# 删除
@page_api.route("/<int:id>", methods=["DELETE"])
def delete_record(id):
    try:
        delete_page(id)
        return jsonify({"success": True, "msg": "删除成功"})
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)})