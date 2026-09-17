# web development
Agrimart is an online web based platform for helping farmers and local sellers build an online presence.

## Product photo verification

Product uploads can be checked by a vision model before they are saved. Set `GEMINI_API_KEY` in the environment running Flask to enable the check. The optional `GEMINI_MODEL` variable can select another Gemini vision model; it defaults to `gemini-2.5-flash`.

Without `GEMINI_API_KEY`, uploads continue to work without image verification. With the key configured, mismatched or ambiguous product photos are rejected for both single and bulk uploads.
