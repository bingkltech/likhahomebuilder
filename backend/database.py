from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


async def init_db():
    """
    Initialize database and create necessary indexes for performance.
    """
    # ⚡ Bolt Performance Optimization:
    # Adding indexes to frequently queried/sorted fields:
    # 1. contacts: sorted by created_at in admin view
    # 2. newsletter_subscribers: unique email for faster upserts, sorted by subscribed_at
    # 3. purchase_inquiries: sorted by created_at in admin view
    try:
        await db.contacts.create_index([("created_at", -1)])
        await db.newsletter_subscribers.create_index([("email", 1)], unique=True)
        await db.newsletter_subscribers.create_index([("subscribed_at", -1)])
        await db.purchase_inquiries.create_index([("created_at", -1)])
    except Exception as e:
        # We catch all exceptions here to ensure the application starts even if
        # indexing fails (e.g., due to duplicate data already existing).
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error creating database indexes: {e}")


async def get_database():
    """Get database instance"""
    return db


def close_db_connection():
    """Close database connection"""
    client.close()