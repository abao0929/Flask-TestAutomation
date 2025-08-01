from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .extensions import db 
import os



def create_app():
    app = Flask(__name__)
    app.config.from_object('config')  # 或 app.config[...] 设置数据库连接

    # 初始化数据库
    db.init_app(app)

    # 注册模型（预留）
    from .models import init_models
    init_models()

    # 注册控制器（预留）
    from .controllers import init_controllers
    init_controllers()

    # 注册视图（预留）
    from .views import init_views
    init_views(app)

    # ...
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')  # 当前项目/uploads 文件夹

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    return app
