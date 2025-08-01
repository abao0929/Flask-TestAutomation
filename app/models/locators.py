import enum
from app.extensions import db

class LocatorMethod(enum.Enum):
    XPATH = "XPATH"
    CSS = "CSS"
    ID = "ID"
    TAG = "TAG"
    CLASS_NAME = "CLASS_NAME"
    LINK_TEXT = "LINK_TEXT"
    PARTIAL_LINK_TEXT = "PARTIAL_LINK_TEXT"

class LocatorOperate(enum.Enum):
    click = "click"
    input = "input"
    wait = "wait"
    get_text = "get_text"
    get_attribute = "get_attribute"

class Locator(db.Model):
    __tablename__ = 'locators'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    method = db.Column(db.Enum(LocatorMethod), nullable=False)  # 限定枚举
    value = db.Column(db.String(255), nullable=False)
    page = db.Column(db.String(100), db.ForeignKey('pages.name'), nullable=False)
    operate = db.Column(db.Enum(LocatorOperate), nullable = False)

    def __repr__(self):
        return f"<Locator {self.name}, method={self.method.value}, operate={self.operate.value}>"

