from app import create_app
from app.extensions import db
from sqlalchemy import text

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        try:
            with db.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            print("✅ 数据库连接成功！")

            # 自动建表
            db.create_all()
            print("✅ 数据表创建完成")
        except Exception as e:
            print("❌ 错误：", e)

    app.run(debug=True)
