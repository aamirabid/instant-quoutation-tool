export type ProjectType =
  | "Basement"
  | "Deck"
  | "Commercial Interior"
  | "Change of Use";
export type ScopeType = "Renovation" | "New Construction";
export type TimelineType = "Standard" | "Rushed";

export interface QuoteRequest {
  fullAddress: string;
  projectType: ProjectType;
  propertySize: number;
  scopeOfWork: ScopeType;
  timelineNeeded: TimelineType;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface QuoteBreakdown {
  basePrice: number;
  sizeAddon: number;
  scopeIncrease: number;
  locationIncrease: number;
  rushFee: number;
}

export interface QuoteResponse {
  finalQuote: number;
  breakdown: QuoteBreakdown;
  referenceNumber: string;
  message: string;
}
