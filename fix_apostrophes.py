import re

with open('/home/ubuntu/ai-legion-frontend/index.html', 'r') as f:
    content = f.read()

# Script tag'ı içindeki Türkçe apostrof sorunlarını düzelt
# Pattern: kelime'ek -> kelime ek (Türkçe ekler)
turkish_suffixes = r"(dan|den|nin|nın|nun|nün|ya|ye|de|da|dır|dir|dur|dür|ın|in|un|ün|ler|lar|lı|li|lu|lü|sı|si|su|sü|nı|ni|nu|nü|yı|yi|yu|yü|deki|daki|ki|nda|nde|ndaki|ndeki)"

content = re.sub(r"(\w)'" + turkish_suffixes + r"(?=[\s,.\";:<>/\)])", r"\1 \2", content)

# Ayrıca 2024 -> 2026 düzelt
content = content.replace("© 2024", "© 2026")

with open('/home/ubuntu/ai-legion-frontend/index.html', 'w') as f:
    f.write(content)

print("Done!")
