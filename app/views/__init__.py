from .locator_view import locator_api
from .page_view import page_api

def init_views(app):
    app.register_blueprint(locator_api)
    app.register_blueprint(page_api)
    pass
