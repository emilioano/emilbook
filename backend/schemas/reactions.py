from configparser import RawConfigParser
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, ClassVar, List
from datetime import datetime

from enum import Enum

from schemas.users import UserResponse

class ReactionType(str, Enum):
    like = 'like'
    love = 'love'
    haha = 'haha'
    sad = 'sad'
    angry = 'angry'


class CreateReaction(BaseModel):
    post_id: int
    comment_id: Optional[int] = None
    reaction: ReactionType

class UpdateReaction(CreateReaction):
    pass

class ReactionsResponse(BaseModel):
    id: int
    user: UserResponse
    post_id: int
    comment_id: Optional[int] = None
    reaction: ReactionType
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)