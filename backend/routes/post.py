from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_

from db.db import get_db
from datetime import datetime
from models.models import Posts
from schemas.post import PostBase, PostResponse, CreatePost, UpdatePost
from schemas.auth import CurrentUser
from core.pw_hash import hash_password
from routes.auth import get_current_user

router = APIRouter (
    prefix = '/post',
    tags=['post']
)

@router.post('/', response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post: CreatePost, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    


    new_post = Posts(
        post = post.post,
        user_id = current_user.user_id,
        created_at = datetime.now()
    )

        
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post

@router.get('/', response_model=List[PostResponse])
async def view_all_posts(db: Session = Depends(get_db)):

    try:
        posts = db.query(Posts).all()
    except Exception as err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Error {err}')

    print(f"Fetched {len(posts)} posts from database")

    return posts


@router.get('/{search_phrase}', response_model=List[PostResponse])
async def view_specific_posts(search_phrase: str, db: Session = Depends(get_db)):
    pattern = f'%{search_phrase}%'

    try:
        posts = (
            db.query(Posts)
            .filter(
                or_(
                    Posts.post.ilike(pattern),
                )
            )    
            .all()
        )
    except Exception as err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Error {err}')

    if not posts:
        print(f'No posts found containing {search_phrase}.')
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with search phrase {search_phrase} not found"
        )
    else:
        print(f'Fetched posts {posts}')
        return posts


@router.put('/{post_id}', response_model=PostResponse)
async def edit_post(post_id: int, post: UpdatePost, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    post_detail = db.query(Posts).filter(Posts.id == post_id).first()
    
    if not post_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'Post with id {post_id} was not found in database!'
        )

    post_detail.id = post_id

    if current_user.user_id != post_detail.user_id:
        print(f'You are only allowed to modify your own posts!')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = f'You are only allowed to modify your own posts!'
            )
    
    post_detail.user_id = current_user.user_id
    post_detail.updated_at = datetime.now()

    post_detail.post = post.post

    db.commit() 
    db.refresh(post_detail)

    print(f'Post with id {post_detail.id} was updated!')
    return post_detail


@router.delete('/{post_id}', response_model=PostResponse)
async def delete_post(post_id: int, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    post_detail = db.query(Posts).filter(Posts.id == post_id).first()
    
    if not post_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'Post with id {post_id} was not found in database!'
        )

    if current_user.user_id != post_detail.user_id:
        print(f'You are only allowed to modify your own posts!')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = f'You are only allowed to modify your own posts!'
            )
    
    db.delete(post_detail)
    db.commit()

    print(f'Post with id {post_detail.id} was deleted!')
    return post_detail

