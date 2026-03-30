from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from db.db import get_db
from datetime import datetime
from models.models import Posts, Comments
from schemas.comments import CommentsResponse, CreateComment, UpdateComment
from schemas.auth import CurrentUser
from routes.auth import get_current_user

router = APIRouter (
    prefix = '/comments',
    tags=['comments']
)

@router.post('/', response_model=CommentsResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(comment: CreateComment, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    
    new_comment = Comments(
        comment = comment.comment,
        user_id = current_user.user_id,
        post_id = comment.post_id,
        parent_comment_id = comment.parent_comment_id,
        created_at = datetime.now()
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment


@router.put('/{comment_id}', response_model=CommentsResponse)
async def edit_comment(comment_id: int, comment: UpdateComment, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    comment_detail = db.query(Comments).filter(Comments.id == comment_id).first()
    
    if not comment_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'Comment with id {comment_id} was not found in database!'
        )

    if current_user.user_id != comment_detail.user_id:
        print(f'You are only allowed to modify your own posts!')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = f'You are only allowed to modify your own posts!'
            )
    
    comment_detail.user_id = current_user.user_id
    comment_detail.updated_at = datetime.now()

    comment_detail.comment = comment.comment

    db.commit() 
    db.refresh(comment_detail)

    print(f'Post with id {comment_detail.id} was updated!')
    return comment_detail


@router.delete('/{comment_id}')
async def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    comment_detail = db.query(Comments).filter(Comments.id == comment_id).first()
    
    if not comment_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'Comment with id {comment_id} was not found in database!'
        )

    if current_user.user_id != comment_detail.user_id:
        print(f'You are only allowed to modify your own comment!')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = f'You are only allowed to modify your own comments!'
            )
    
    db.delete(comment_detail)
    db.commit()

    print(f'Comment with id {comment_detail.id} was deleted!')
    return {"detail": f'Comment with id {comment_id} was deleted'}