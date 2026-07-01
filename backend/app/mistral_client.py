"""Mistral AI chat completion via direct HTTP (no SDK dep)."""
import os
import httpx
from typing import List, Dict

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY", "")
MISTRAL_MODEL = os.environ.get("MISTRAL_MODEL", "mistral-large-latest")
MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"


SYSTEM_PROMPT = (
    "You are the GCSR AI Copilot for the Gujarat State Data Lakehouse and Common Social "
    "Registry (GCSR). You help state administrators, department officers, and district "
    "officers understand citizen data, family registry insights, DBT (Direct Benefit "
    "Transfer) coverage, scheme saturation, welfare leakage, and data quality across "
    "Gujarat's 33 districts. Answer concisely, cite districts, schemes, or department "
    "names when relevant, and suggest concrete next actions. When asked policy or "
    "eligibility questions, note that suggestions are advisory and must be validated by "
    "district officers before action."
)


async def chat_completion(messages: List[Dict], temperature: float = 0.3) -> str:
    """Call Mistral chat completion. Returns assistant content string."""
    if not MISTRAL_API_KEY:
        return "AI Copilot is not configured. Please set MISTRAL_API_KEY."

    payload_msgs = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post(
            MISTRAL_URL,
            headers={
                "Authorization": f"Bearer {MISTRAL_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MISTRAL_MODEL,
                "messages": payload_msgs,
                "temperature": temperature,
                "max_tokens": 800,
            },
        )
        if resp.status_code != 200:
            return (
                f"[Mistral API returned {resp.status_code}] "
                "Please retry. Response: " + resp.text[:200]
            )
        data = resp.json()
        return data["choices"][0]["message"]["content"]
