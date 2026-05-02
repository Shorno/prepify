import json

with open(r'C:\Users\Shorno\.gemini\antigravity\brain\f2e3b6c3-7cc8-41f6-ac33-28ccb318043f\.system_generated\steps\188\output.txt', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Also get full text of the problematic Heading 4 paragraphs
problem_indices = [316, 317, 318, 321, 322, 323, 324]
for p in data['paragraphs']:
    if p['index'] in problem_indices:
        print(f"\n[{p['index']}] style={p['style']}")
        print(f"  FULL TEXT: {p['text']}")
