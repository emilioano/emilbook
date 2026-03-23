from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, ClassVar
from datetime import datetime

class PostBase(BaseModel):
    post: str = Field(..., min_length=2, max_length=5000, description='Post')

class CreatePost(PostBase):
    pass

class UpdatePost(PostBase):
    pass

class PostResponse(PostBase):
    id: int = Field(..., description='Post id')
    user_id: int = Field(..., description='Post id')
    created_at: datetime = Field(..., description='Timestamp')
    updated_at: Optional[datetime] = Field(None, description='Timestamp')

    class Config:
        from_attributes = True
        json_schema = {
            "example": {
                "id": "1",
                "user_id": "1",
                "post": "This is my diary post",
                "created_at": "2026-03-09",
                "updated_at": "2026-03-09"
            }
        }

