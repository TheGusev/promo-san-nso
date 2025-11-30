-- Change numeric columns to BIGINT to prevent overflow from large values
-- This prevents issues with Android autofill inserting phone numbers into numeric fields

ALTER TABLE leads 
  ALTER COLUMN area_m2 TYPE bigint,
  ALTER COLUMN base_price TYPE bigint,
  ALTER COLUMN discount_amount TYPE bigint,
  ALTER COLUMN final_price TYPE bigint;