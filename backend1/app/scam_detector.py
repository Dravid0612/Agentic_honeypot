SCAM_KEYWORDS = [
    "blocked", "suspended", "verify", "upi",
    "otp", "bank", "account", "urgent"
]

class ScamDetector:
    def __init__(self):
        self.keywords = SCAM_KEYWORDS
    
    def detect(self, text: str) -> dict:
        """Detect if text contains scam indicators"""
        text_lower = text.lower()
        score = sum(1 for k in self.keywords if k in text_lower)
        
        is_scam = score >= 2
        
        return {
            "isScam": is_scam,
            "confidence": min(score / len(self.keywords), 1.0),
            "scamType": "UPI_FRAUD" if "upi" in text_lower else "GENERIC_FRAUD"
        }

# Keep the function for backward compatibility
def detect_scam(text: str) -> dict:
    detector = ScamDetector()
    return detector.detect(text)