from fastapi import APIRouter, HTTPException, status, Depends, Response
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from db.db import get_db
from datetime import datetime
from models.models import Posts, Comments, Reactions
from schemas.comments import CommentsResponse
from schemas.reactions import CreateReaction, ReactionsResponse, UpdateReaction
from schemas.auth import CurrentUser
from routes.auth import get_current_user

router = APIRouter (
    prefix = '/reactions',
    tags=['reactions']
)

@router.post('/', response_model=ReactionsResponse, status_code=status.HTTP_201_CREATED)
async def create_reaction(reaction: CreateReaction, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    
    new_reaction = Reactions(
        user_id = current_user.user_id,
        post_id = reaction.post_id,
        comment_id = reaction.comment_id,
        reaction = reaction.reaction,
        created_at = datetime.now()
    )

    existing_reaction = db.query(Reactions).filter(
        Reactions.user_id == current_user.user_id,
        Reactions.post_id == reaction.post_id,
        Reactions.comment_id == reaction.comment_id
    ).first()

    if existing_reaction:
        if existing_reaction.reaction == reaction.reaction:
            # Samma reaktion – ta bort den
            db.delete(existing_reaction)
            db.commit()
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        else:
            # Annan reaktion – uppdatera den
            existing_reaction.reaction = reaction.reaction
            existing_reaction.updated_at = datetime.now()
            db.commit()
            db.refresh(existing_reaction)
            return existing_reaction

    db.add(new_reaction)
    db.commit()
    db.refresh(new_reaction)

    return new_reaction


@router.put('/{reaction_id}', response_model=ReactionsResponse)
async def edit_reaction(reaction_id: int, reaction: UpdateReaction, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    reaction_detail = db.query(Reactions).filter(Reactions.id == reaction_id).first()
    
    if not reaction_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'Reaction with id {reaction_id} was not found in database!'
        )

    if current_user.user_id != reaction_detail.user_id:
        print(f'You are only allowed to modify your own reactions!')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = f'You are only allowed to modify your own reactions!'
            )
    
    reaction_detail.user_id = current_user.user_id
    reaction_detail.updated_at = datetime.now()

    reaction_detail.reaction = reaction.reaction

    db.commit() 
    db.refresh(reaction_detail)

    print(f'Post with id {reaction_detail.id} was updated!')
    return reaction_detail


@router.delete('/{reaction_id}')
async def delete_reaction(reaction_id: int, db: Session = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):

    reaction_detail = db.query(Reactions).filter(Reactions.id == reaction_id).first()
    
    if not reaction_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = f'Reaction with id {reaction_id} was not found in database!'
        )

    if current_user.user_id != reaction_detail.user_id:
        print(f'You are only allowed to modify your own reactions!')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = f'You are only allowed to modify your own reactions!'
            )
    
    db.delete(reaction_detail)
    db.commit()

    print(f'Reaction with id {reaction_detail.id} was deleted!')
    return {"detail": f'Reaction with id {reaction_id} was deleted'}