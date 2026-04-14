import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]


async def get_database():
    """Get database instance"""
    return db


async def init_db():
    """Initialize database indexes for performance"""
    # Index for email lookups and uniqueness in newsletter
    await db.newsletter_subscribers.create_index("email", unique=True)
    # Indexes for descending date sorts (common in admin views)
    await db.newsletter_subscribers.create_index([("subscribed_at", -1)])
    await db.contacts.create_index([("created_at", -1)])
    await db.purchase_inquiries.create_index([("created_at", -1)])


def close_db_connection():
    """Close database connection"""
    client.close()
