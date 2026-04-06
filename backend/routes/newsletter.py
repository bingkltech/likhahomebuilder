from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging
from pymongo import ReturnDocument
from models import NewsletterSubscriber, NewsletterSubscriberCreate
from database import get_database
from auth import verify_admin_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post(
    "", response_model=NewsletterSubscriber, status_code=status.HTTP_201_CREATED
)
async def subscribe_newsletter(subscriber_data: NewsletterSubscriberCreate):
    """
    Subscribe to newsletter
    """
    try:
        db = await get_database()

        # Create subscriber object for potential insertion
        new_subscriber = NewsletterSubscriber(**subscriber_data.dict())

        # Atomically find and update or insert (upsert)
        # If the subscriber exists, we ensure is_active is True
        # If it doesn't exist, we insert the new_subscriber data
        existing = await db.newsletter_subscribers.find_one_and_update(
            {"email": subscriber_data.email},
            {"$setOnInsert": new_subscriber.dict(), "$set": {"is_active": True}},
            upsert=True,
            return_document=ReturnDocument.BEFORE,
        )

        if existing:
            # If existed and was already active, raise exception
            if existing.get("is_active", False):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already subscribed to newsletter",
                )
            # If existed but was inactive, it's now reactivated
            logger.info(f"Reactivated newsletter subscriber: {subscriber_data.email}")
            # Ensure we return the subscriber with updated state
            existing["is_active"] = True
            return NewsletterSubscriber(**existing)

        logger.info(f"New newsletter subscriber: {new_subscriber.email}")
        return new_subscriber

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to subscribe to newsletter",
        )


@router.get("", response_model=List[NewsletterSubscriber])
async def get_all_subscribers(token: str = Depends(verify_admin_token)):
    """
    Get all newsletter subscribers (Admin endpoint)
    """
    try:
        db = await get_database()
        subscribers = (
            await db.newsletter_subscribers.find({"is_active": True})
            .sort("subscribed_at", -1)
            .to_list(1000)
        )

        return [NewsletterSubscriber(**sub) for sub in subscribers]

    except Exception as e:
        logger.error(f"Error fetching subscribers: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch subscribers",
        )
