from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_

from db.db import get_db
from datetime import datetime
from models.models import Users
from schemas.user import CreateUser, UserResponse, UpdateUser
from schemas.auth import CurrentUser
from core.pw_hash import hash_password
from routes.auth import get_current_user

router = APIRouter(
    prefix='/user',
    tags=['user']
)

@router.get("/", response_model=List[UserResponse])
async def get_all_users(db: Session = Depends(get_db)):
    # Fetches all users from DB.
    try:
        users = db.query(Users).all()
    except Exception as err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Error {err}')

    print(f"Fetched {len(users)} records from database")

    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No users found!')

    return users

@router.get('/{search_phrase}', response_model=List[UserResponse])
async def get_specific_users(search_phrase: str, db: Session = Depends(get_db)):
    # Fetching username or email that matches search phrase
    pattern = f'%{search_phrase}%'

    try:
        users = (
            db.query(Users)
            .filter(
                or_(
                    Users.username.ilike(pattern),
                    Users.email.ilike(pattern),
                )
            )    
            .all()
        )
    except Exception as err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Error {err}')


    if not users:
        print(f'No posts found containing {search_phrase}.')
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User with search phrase {search_phrase} not found"
        )
    else:
        print(f'Fetched users {users}')
        return users


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: CreateUser, db: Session = Depends(get_db)):
    try:    
        existing_user = (
        db.query(Users)
        .filter(
            or_(
                Users.username.ilike(user.username),
                Users.email.ilike(user.email) if user.email else False,
            )
        )    
        .first()
        )

        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User already exists!')

        password_hash = hash_password(user.password)

        # Create the new user
        new_user = Users(
            username=user.username,
            email=user.email,
            password_hash=password_hash
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except HTTPException:
        raise
    except Exception as err:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {err}"
        )

    print(f"Created new user: {new_user.username} (ID: {new_user.id})")
    return new_user


@router.delete('/{userid}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    user_detail = db.query(Users).filter(Users.id == user_id).first()

    if not user_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'User with id {user_id} was not found in database!'
        )

    if current_user.user_id != user_detail.id:
        print(f'You are only allowed to modify your own user!')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = f'You are only allowed to modify your own user!'
            )

    db.delete(user_detail)
    db.commit()


@router.put('/{user_id}', response_model=UserResponse)
async def update_user(user_id: int, update_user: UpdateUser, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    user_detail = db.query(Users).filter(Users.id == user_id).first()

    if not user_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'User with id {user_id} was not found in database!'
        )

    if current_user.user_id != user_detail.id:
        print(f'You are only allowed to modify your own user!')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = f'You are only allowed to modify your own user!'
            )
    
    if update_user.email is not None:
        existing_email = db.query(Users).filter(
            Users.email == update_user.email,
    	    Users.id != user_detail.id
        ).first()

        if existing_email:
            print(f'A user with email address {update_user.email} is already existing!')
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail = f'A user with email address {update_user.email} is already existing!'
            )

        user_detail.email = update_user.email

    if update_user.username is not None:
        existing_username = db.query(Users).filter(
            Users.username == update_user.username,
    	    Users.id != user_detail.id
        ).first()

        if existing_username:
            print(f'A user with username {update_user.username} is already existing!')
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail = f'A user with username {update_user.username} is already existing!'
            )

        user_detail.username = update_user.username

    if update_user.password:
        update_user.password = hash_password(update_user.password)
        user_detail.password_hash = update_user.password

    db.commit() 
    db.refresh(user_detail)

    print(f'User with id {user_detail.id} was updated!')
    return user_detail