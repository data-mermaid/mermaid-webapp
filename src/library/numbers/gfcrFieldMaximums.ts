/**
 * Maximums implied by max_digits and decimal_places on the GFCR models in mermaid-api
 * (src/api/models/gfcr.py). Going over returns a 400 with no field-level feedback in the
 * UI, so the inputs clamp on blur instead.
 */

// max_digits 11, decimal_places 5
export const GFCR_MAX_AREA_SQ_KM = 999999.99999

// The API allows up to 999.9, but cover cannot exceed 100%.
export const GFCR_MAX_PERCENTAGE = 100

// max_digits 5, decimal_places 1
export const GFCR_MAX_BIOMASS_KG_PER_HA = 9999.9

// max_digits 12, decimal_places 2
export const GFCR_MAX_INVESTMENT_AMOUNT = 9999999999.99

// max_digits 11, decimal_places 2
export const GFCR_MAX_REVENUE_AMOUNT = 999999999.99
