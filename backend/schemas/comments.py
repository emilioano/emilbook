from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, ClassVar, List
from datetime import datetime

from schemas.users import UserResponse
from schemas.reactions import ReactionsResponse

class CommentsBase(BaseModel):
    post_id: int = Field(..., description='Post id for the post that is being commented on')
    parent_comment_id: Optional[int] = Field(None, description='In case we are commenting on another comment')
    comment: str = Field(..., min_length=2, max_length=5000, description='Comment')


class CreateComment(CommentsBase):
    pass

class UpdateComment(BaseModel):
    comment: str = Field(..., min_length=2, max_length=5000, description='Comment')

class CommentsResponse(BaseModel):
    id: int
    post_id: int
    parent_comment_id: Optional[int] = None
    comment: str
    user: UserResponse
    reactions: List[ReactionsResponse] = []
    created_at: datetime
    updated_at: Optional[datetime] = None
    replies: List['CommentsResponse'] = []
    model_config = ConfigDict(from_attributes=True)

CommentsResponse.model_rebuild()