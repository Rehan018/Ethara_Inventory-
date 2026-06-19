from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, BadRequestError
from app.core.security import create_access_token, hash_password, verify_password
from app.models import User
from app.repositories.users import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.users = UserRepository(db)

    def register(self, payload: UserCreate) -> TokenResponse:
        if self.users.get_by_email(payload.email):
            raise ConflictError("This email is already registered")

        user = User(
            full_name=payload.full_name.strip(),
            email=payload.email.lower(),
            hashed_password=hash_password(payload.password),
        )
        self.users.create(user)

        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError("This email is already registered") from exc

        self.db.refresh(user)
        token = create_access_token(str(user.id))
        return TokenResponse(access_token=token, user=user)

    def login(self, payload: LoginRequest) -> TokenResponse:
        user = self.users.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user.hashed_password):
            raise BadRequestError("Invalid email or password")
        if not user.is_active:
            raise BadRequestError("This account is inactive")

        token = create_access_token(str(user.id))
        return TokenResponse(access_token=token, user=user)
