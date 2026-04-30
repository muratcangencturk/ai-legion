import re

with open('index.html','r',encoding='utf-8') as f:
    lines = f.readlines()

# Find allLearn block lines
start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if 'function loadLearnContent' in line:
        # find allLearn = [ inside this function
        for j in range(i+1, len(lines)):
            if 'allLearn =' in lines[j]:
                start_idx = j
                break
    if start_idx is not None and end_idx is None and '];' in lines[i] and i>start_idx:
        end_idx = i
        break

print(f'allLearn block lines {start_idx+1}-{end_idx+1}')

# Extract entries from those lines
block_lines = lines[start_idx:end_idx+1]
block_text = ''.join(block_lines)
# Split entries: each starts with { and ends with },
entries = re.findall(r"\{[\s\S]*?image_url:\s*'[^']+'\s*\}", block_text)
print(f'Total entries parsed: {len(entries)}')

# Separate categories
haberler = []
others = []
for e in entries:
    if "category: 'Haberler'" in e:
        haberler.append(e)
    else:
        others.append(e)

print(f'Haberler: {len(haberler)}, Others: {len(others)}')
for h in haberler:
    m = re.search(r"title:\s*'([^']+)", h)
    print(f'  REMOVE: {m.group(1) if m else h[:50]}')

# Rebuild block
inner = ',\n    '.join(others)
new_block = f'  allLearn = [\n    {inner}\n  ];\n'

# Replace in lines
new_lines = lines[:start_idx] + [new_block] + lines[end_idx+1:]
with open('index.html','w',encoding='utf-8') as f:
    f.writelines(new_lines)
print('Done, wrote back')
