"""
Database configuration and models for PostgreSQL integration.
"""
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean, JSON, ForeignKey, Index, Float
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

from config import settings

# Database URL from environment
DATABASE_URL = str(settings.DATABASE_URL)

# Create engines
engine = create_engine(DATABASE_URL)

# Handle async engine creation based on database type
if DATABASE_URL.startswith("sqlite"):
    # For SQLite, use aiosqlite driver for async support
    async_engine = create_async_engine(DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://", 1))
else:
    # For PostgreSQL, use asyncpg driver
    async_engine = create_async_engine(DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1))

# Session makers
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
AsyncSessionLocal = async_sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)

# Base class for models
Base = declarative_base()

# User model for authentication
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationship to API keys
    api_keys = relationship("APIKey", back_populates="user")

# Lead model
class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    industry = Column(String(100))
    source = Column(String(100))
    score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

# Content model
class Content(Base):
    __tablename__ = "content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    industry = Column(String(100))
    status = Column(String(50), default='draft')
    created_at = Column(DateTime, default=datetime.now)
    published_at = Column(DateTime)

# API Key model for storing encrypted API keys
class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String(50), nullable=False)  # 'openai', 'google', 'deepseek', 'huggingface'
    encrypted_key = Column(String(512), nullable=False)  # Encrypted API key
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    last_used = Column(DateTime, nullable=True)
    
    # Relationship to user
    user = relationship("User", back_populates="api_keys")

# Rate Limit model for tracking rate limits per IP and API key
class RateLimit(Base):
    __tablename__ = "rate_limits"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String(255), nullable=False, index=True)  # IP address or API key
    identifier_type = Column(String(20), nullable=False)  # 'ip' or 'api_key'
    endpoint = Column(String(255), nullable=False)
    request_count = Column(Integer, default=0)
    window_start = Column(DateTime, default=datetime.now)
    window_end = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        Index('idx_identifier_endpoint', 'identifier', 'endpoint'),
    )

# Usage Tracking model for tracking API usage
class UsageTracking(Base):
    __tablename__ = "usage_tracking"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    endpoint = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)
    status_code = Column(Integer, nullable=False)
    response_time = Column(Float)  # Response time in milliseconds
    user_agent = Column(String(512), nullable=True)
    timestamp = Column(DateTime, default=datetime.now)
    created_at = Column(DateTime, default=datetime.now)

    # Relationships
    user = relationship("User")
    api_key = relationship("APIKey")

    __table_args__ = (
        Index('idx_user_timestamp', 'user_id', 'timestamp'),
        Index('idx_api_key_timestamp', 'api_key_id', 'timestamp'),
        Index('idx_ip_timestamp', 'ip_address', 'timestamp'),
    )

# API Access Request model for CRM email collection
class APIAccessRequest(Base):
    __tablename__ = "api_access_requests"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=True)
    requested_tools = Column(JSON, nullable=True)  # List of requested tools/endpoints
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(512), nullable=True)
    granted_access = Column(Boolean, default=False)
    access_granted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        Index('idx_email', 'email'),
        Index('idx_granted_access', 'granted_access'),
    )

# Voice Session model for multi-turn conversation state
class VoiceSession(Base):
    __tablename__ = "voice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    current_state = Column(String(50), default="init")  # e.g., init, greeting, collecting_details, confirming, booked
    context = Column(JSON, default=dict)  # Store conversation context and collected data
    conversation_history = Column(JSON, default=list)  # Store history of messages
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    expires_at = Column(DateTime, nullable=True)  # Session expiration time

    # Relationship to user
    user = relationship("User")

    __table_args__ = (
        Index('idx_session_id', 'session_id'),
        Index('idx_user_id', 'user_id'),
        Index('idx_is_active', 'is_active'),
        Index('idx_expires_at', 'expires_at'),
    )

# Notification model for storing email and SMS notifications
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    channel = Column(String(20), nullable=False)  # 'email', 'sms', 'whatsapp'
    recipient = Column(String(255), nullable=False)  # email address or phone number
    subject = Column(String(255), nullable=True)  # For email notifications
    message = Column(Text, nullable=False)
    status = Column(String(20), default='sent')  # 'sent', 'delivered', 'failed'
    provider_response = Column(JSON, nullable=True)  # Raw response from provider
    created_at = Column(DateTime, default=datetime.now)
    sent_at = Column(DateTime, default=datetime.now)
    delivered_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index('idx_channel', 'channel'),
        Index('idx_recipient', 'recipient'),
        Index('idx_status', 'status'),
        Index('idx_created_at', 'created_at'),
    )


# Payment model for tracking transactions
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)  # Payment amount
    currency = Column(String(3), default="USD")  # Currency code, e.g., USD, EUR
    status = Column(String(20), default="pending")  # pending, completed, failed, refunded
    paypal_payment_id = Column(String(255), unique=True, index=True)  # PayPal transaction ID
    description = Column(Text, nullable=True)  # Payment description
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # Relationship to user
    user = relationship("User")

    __table_args__ = (
        Index('idx_user_id_status', 'user_id', 'status'),
        Index('idx_paypal_payment_id', 'paypal_payment_id'),
        Index('idx_status_created_at', 'status', 'created_at'),
    )

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Async dependency to get DB session
async def get_async_db() -> AsyncSession:
    """
    Async generator that yields an async database session.
    Use with: async for db in get_async_db():
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()