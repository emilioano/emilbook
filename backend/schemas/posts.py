from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, ClassVar, List
from datetime import datetime

from schemas.users import UserResponse
from schemas.comments import CommentsResponse
from schemas.reactions import ReactionsResponse

class PostBase(BaseModel):
    post: str = Field(..., min_length=2, max_length=5000, description='Post')

class CreatePost(PostBase):
    pass

class UpdatePost(PostBase):
    pass

class PostResponse(BaseModel):
    id: int
    post: str
    comments: List[CommentsResponse] = []
    reactions: List[ReactionsResponse] = []
    user: UserResponse
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


