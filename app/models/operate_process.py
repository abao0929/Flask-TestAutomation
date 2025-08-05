import enum
from app.extensions import db

class OperateProcess(db.Model):
    __tabelname__ = "OperateProcess"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)