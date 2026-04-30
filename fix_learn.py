import re

with open('index.html','r',encoding='utf-8') as f:
    lines = f.readlines()

start_line = None
end_line = None
for i, line in enumerate(lines):
    if 'allLearn =' in line:
        start_line = i
    if start_line is not None and end_line is None and '];' in line and i > start_line:
        end_line = i
        break

print(f'allLearn block: {start_line+1}-{end_line+1}')

block = ''.join(lines[start_line:end_line+1])
inner = block[block.index('[')+1:block.rindex('];')]

# Find all entries: match { ... }
entries = re.findall(r'\{[\s\S]*?\}', inner)
print(f'Total entries: {len(entries)}')

# Filter entries (keep non-Haberler)
filtered = []
removed = []
for e in entries:
    if "category: 'Haberler'" in e:
        removed.append(e)
    else:
        filtered.append(e)

print(f'Kept: {len(filtered)}, Removed: {len(removed)}')
for r in removed:
    m = re.search(r"title:\s*'([^']+)", r)
    print(f'  REMOVED: {m.group(1) if m else r[:50]}')

for f in filtered:
    m = re.search(r"title:\s*'([^']+)", f)
    print(f'  KEPT: {m.group(1) if m else f[:50]}')

# Rebuild
new_block = '  allLearn = [\n    ' + ',\n    '.join(filtered) + '\n  ];'
new_lines = lines[:start_line] + [new_block + '\n'] + lines[end_line+1:]
with open('index.html','w',encoding='utf-8') as out:
    out.writelines(new_lines)
print('Done')
