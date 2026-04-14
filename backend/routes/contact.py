from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging
from models import ContactForm, ContactFormCreate
from database import get_database
from auth import verify_admin_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactForm, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(form_data: ContactFormCreate):
    """
    Submit a contact form
    """
    try:
        db = await get_database()

        # Create contact form object
        contact = ContactForm(**form_data.dict())

        # Insert into database
        result = await db.contacts.insert_one(contact.dict())

        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to submit contact form",
            )

        logger.info(f"Contact form submitted: {contact.email}")
        return contact

    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact form",
        )


@router.get("", response_model=List[ContactForm])
async def get_all_contacts(token: str = Depends(verify_admin_token)):
    """
    Get all contact form submissions (Admin endpoint)
    """
    try:
        db = await get_database()
        contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
        return [ContactForm(**contact) for contact in contacts]

    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch contacts",
        )
