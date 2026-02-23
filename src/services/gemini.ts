import { VerificationResult } from "../types";

export async function analyzePropertyDocuments(documentsText: string): Promise<VerificationResult> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentsText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to analyze documents");
    }

    const result = await response.json();
    return result as VerificationResult;
  } catch (error: any) {
    console.error("Error calling backend API:", error);
    throw new Error(error.message || "Failed to connect to the analysis server.");
  }
}
