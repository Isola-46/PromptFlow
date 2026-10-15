with open('src/data/workflows.ts') as f:
    text = f.read()

idx = text.find("id: 'ultimate-stickman-animation-master'")
next_idx = text.find("id: 'ai-image-luxury-product-macro'")
block = text[idx:next_idx]

for key in ['part1Prompt', 'part2Prompt', 'part3Prompt', 'part1Title', 'part2Title', 'part3Title', 'masterPromptText']:
    pos = block.find(key + ':')
    if pos != -1:
        print(f"=== {key} found at {pos} ===")
        print(block[pos:pos+250])
