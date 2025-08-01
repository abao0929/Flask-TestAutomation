from .locator_view import locator_view
from .page_view import page_view
from .operate_view import operate_view


def init_views(app):
    app.register_blueprint(locator_view)
    app.register_blueprint(page_view)
    app.register_blueprint(operate_view)
    pass
