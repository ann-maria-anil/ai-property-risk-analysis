export interface OwnershipEvent {
  year: string;
  event: string;
  party: string;
  details: string;
}

export interface RiskFactor {
  type: 'Legal' | 'Financial' | 'Structural' | 'Ownership';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  recommendation: string;
}

export interface VerificationResult {
  propertySummary: string;
  ownershipTimeline: OwnershipEvent[];
  risks: RiskFactor[];
  riskScore: number; // 0-100
  categoryScores: {
    Legal: number;
    Financial: number;
    Structural: number;
    Ownership: number;
  };
  legalStatus: string;
  surveyDetails: string;
}

export interface PropertyDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  encryptedContent?: ArrayBuffer;
  status: 'pending' | 'processing' | 'completed' | 'error';
}
