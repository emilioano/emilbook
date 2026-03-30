from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import Optional, ClassVar
from datetime import datetime


class UserBase(BaseModel):
    username: str = Field(..., min_length=2, max_length=64, description='Username')
    email: Optional[EmailStr] = Field(None, description='email')

    @field_validator('username')
    @classmethod
    def username_cannot_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Username can not be empty')
        return v.strip()


class CreateUser(UserBase):
    password: str = Field(..., min_length=6, description='User password')

    _special_chars: ClassVar[str]='!"#¤%&/()=@'

    @field_validator('password')
    @classmethod
    def password_validation(cls, v: str) -> str:
        v = v.strip()
        if not any(ch in v for ch in cls._special_chars):
            raise ValueError("Password needs to contain at least one special character")
        return v


class UpdateUser(UserBase):
    username: str = Field(..., min_length=2, max_length=64, description='Username')
    email: Optional[EmailStr] = Field(None, description='email')
    password: Optional[str] = Field(None, min_length=6, description="User's password (minimum 6 characters)")

    _special_chars: ClassVar[str]='!"#¤%&/()=@'

    @field_validator('password')
    @classmethod
    def password_validation(cls, v: str) -> str:
        if v is None:
            return v
        v = v.strip()
        if not any(ch in v for ch in cls._special_chars):
            raise ValueError("Password needs to contain at least one special character")
        return v


class UserResponse(UserBase):
    id: int = Field(..., description='User id')
    email: Optional[EmailStr] = Field(None, description='Users email')
    create_time: datetime = Field(..., description='Time when created')

    model_config = ConfigDict(from_attributes=True)
