-- Add original_image_path column to image_generation_requests table
ALTER TABLE image_generation_requests
ADD COLUMN original_image_path TEXT;

-- Add comment to the column
COMMENT ON COLUMN image_generation_requests.original_image_path IS 'Path to the original uploaded image file'; 