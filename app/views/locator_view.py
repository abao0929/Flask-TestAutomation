from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from app.models.pages import Page
from app.controllers.locators.locators_controller import (
    add_locator,
    edit_locator,
    get_locator_by_id,
    delete_locator,
    get_all_locators,
    get_all_methods,
    get_all_operates,
    filter_locators,
)
from app.models.locators import Locator, LocatorMethod, LocatorOperate
from app.extensions import db

locator_api = Blueprint("locator_api", __name__, url_prefix="/api/locator")

# 1. 获取列表
@locator_api.route("", methods=["GET"])
def get_locator_list():
    data = get_all_locators()
    return jsonify(data)
    

# 2. 新增
@locator_api.route("/add", methods=["POST"])
def create_locator():
    data = request.json
    try:
        add_locator(
            data["name"], data["method"], data["value"],
            data["page"], data["operate"]
        )
        return jsonify({"success": True, "msg": "添加成功"})
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)})

# 编辑
@locator_api.route("/edit/<int:id>", methods=["PUT"])
def edit_record(id):
    data = request.json
    try:
        edit_locator(
            id,
            data["name"], data["method"], data["value"],
            data["page"], data["operate"]
        )
        return jsonify({"success": True, "msg": "编辑成功"})
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)})
    
# 删除
@locator_api.route("/<int:id>", methods=["DELETE"])
def delete_record(id):
    try:
        delete_locator(id)
        return jsonify({"success": True, "msg": "删除成功"})
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)})


@locator_api.route("/method", methods=['GET'])
def get_methods():
    return jsonify({
        "methods": get_all_methods(),
    })

@locator_api.route("/operate", methods=['GET'])
def get_operates():
    return jsonify({
        "operates": get_all_operates(),
    })

@locator_api.route("/filter", methods=["GET"])
def filter_locator_api():
    page = request.args.get('page')
    operate = request.args.get('operate')
    data = filter_locators(page=page, operate=operate)
    return jsonify(data)
