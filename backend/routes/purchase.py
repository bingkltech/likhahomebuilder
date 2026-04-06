from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging
from models import PurchaseInquiry, PurchaseInquiryCreate
from database import get_database
from auth import verify_admin_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/purchase", tags=["purchase"])


@router.post("", response_model=PurchaseInquiry, status_code=status.HTTP_201_CREATED)
async def submit_purchase_inquiry(inquiry_data: PurchaseInquiryCreate):
    """
    Submit a purchase inquiry
    """
    try:
        db = await get_database()

        # Create purchase inquiry object
        inquiry = PurchaseInquiry(**inquiry_data.dict())

        # Insert into database
        result = await db.purchase_inquiries.insert_one(inquiry.dict())

        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to submit purchase inquiry",
            )

        logger.info(
            f"Purchase inquiry submitted: {inquiry.email} - {inquiry.project_interest}"
        )
        return inquiry

    except Exception as e:
        logger.error(f"Error submitting purchase inquiry: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit purchase inquiry",
        )


@router.get("", response_model=List[PurchaseInquiry])
async def get_all_inquiries(token: str = Depends(verify_admin_token)):
    """
    Get all purchase inquiries (Admin endpoint)
    """
    try:
        db = await get_database()
        inquiries = (
            await db.purchase_inquiries.find().sort("created_at", -1).to_list(1000)
        )
        return [PurchaseInquiry(**inquiry) for inquiry in inquiries]

    except Exception as e:
        logger.error(f"Error fetching inquiries: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch inquiries",
        )
