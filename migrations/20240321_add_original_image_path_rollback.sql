-- Remove original_image_path column from image_generation_requests table
ALTER TABLE image_generation_requests
DROP COLUMN original_image_path; 