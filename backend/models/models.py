from typing import Optional
import datetime

from sqlalchemy import ForeignKeyConstraint, Index, Integer, String, TIMESTAMP, Text, text, and_
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, foreign

class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255, 'utf8mb4_unicode_ci'))
    create_time: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))

    posts: Mapped[list['Posts']] = relationship('Posts', back_populates='user', cascade='all, delete-orphan')
    comments: Mapped[list['Comments']] = relationship('Comments', back_populates='user', cascade='all, delete-orphan')
    reactions: Mapped[list['Reactions']] = relationship('Reactions', back_populates='user', cascade='all, delete-orphan')


class Posts(Base):
    __tablename__ = 'posts'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], name='User'),
        Index('User_idx', 'user_id')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False)
    post: Mapped[str] = mapped_column(Text(collation='utf8mb4_unicode_ci'), nullable=False)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP)

    user: Mapped['Users'] = relationship('Users', back_populates='posts')
 # For cascade deletion
    comments_all: Mapped[list['Comments']] = relationship(
        'Comments',
        back_populates='post',
        cascade='all, delete-orphan',
        order_by='Comments.created_at.desc()'
    )
    reactions_all: Mapped[list['Reactions']] = relationship(
        'Reactions',
        back_populates='post',
        cascade='all, delete-orphan'
    )

    # For filtered query
    comments: Mapped[list['Comments']] = relationship(
        'Comments',
        primaryjoin='and_(Comments.post_id == Posts.id, Comments.parent_comment_id == None)',
        viewonly=True,
        order_by='Comments.created_at.desc()'
    )
    reactions: Mapped[list['Reactions']] = relationship(
        'Reactions',
        primaryjoin='and_(Reactions.post_id == Posts.id, Reactions.comment_id == None)',
        viewonly=True
    )

class Comments(Base):
    __tablename__ = 'comments'
    __table_args__ = (
        ForeignKeyConstraint(['post_id'], ['posts.id'], name='comments_fk_post_id'),
        ForeignKeyConstraint(['user_id'], ['users.id'], name='comments_fk_user_id'),
        ForeignKeyConstraint(['parent_comment_id'], ['comments.id'], name='comments_fk_parent_id'),
        Index('PostId_idx', 'post_id'),
        Index('comments_fk_user_id_idx', 'user_id')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(Integer, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text(collation='utf8mb4_unicode_ci'), nullable=False)
    parent_comment_id: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP)

    post: Mapped['Posts'] = relationship('Posts', back_populates='comments')
    user: Mapped['Users'] = relationship('Users', back_populates='comments')
    reactions: Mapped[list['Reactions']] = relationship('Reactions', back_populates='comment')

    replies: Mapped[list['Comments']] = relationship('Comments', back_populates='parent', cascade="all, delete-orphan", foreign_keys=[parent_comment_id])
    parent:  Mapped[Optional['Comments']] = relationship('Comments', back_populates='replies', remote_side=[id], foreign_keys=[parent_comment_id])


class Reactions(Base):
    __tablename__ = 'reactions'
    __table_args__ = (
        ForeignKeyConstraint(['comment_id'], ['comments.id'], name='reactions_fk_comment_id'),
        ForeignKeyConstraint(['post_id'], ['posts.id'], name='reactions_fk_post_id'),
        ForeignKeyConstraint(['user_id'], ['users.id'], name='reactions_fk_user_id'),
        Index('comment_id_idx', 'comment_id'),
        Index('post_id_idx', 'post_id'),
        Index('user_id_idx', 'user_id')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False)
    post_id: Mapped[Optional[int]] = mapped_column(Integer)
    comment_id: Mapped[Optional[int]] = mapped_column(Integer)
    reaction: Mapped[Optional[str]] = mapped_column(String(255, 'utf8mb4_unicode_ci'))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP)

    comment: Mapped[Optional['Comments']] = relationship('Comments', back_populates='reactions')
    post: Mapped[Optional['Posts']] = relationship('Posts', back_populates='reactions')
    user: Mapped['Users'] = relationship('Users', back_populates='reactions')

