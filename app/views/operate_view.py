from flask import Blueprint, render_template
from app.models.locators import Locator
from app.extensions import db

operate_view = Blueprint('operate_view', __name__)

@operate_view.route('/operate')
def operate():
    locators = Locator.query.all()
    print("operate页面locators数量：", len(locators))
    return render_template('operate.html', locators=locators)