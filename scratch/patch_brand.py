#!/usr/bin/env python3
"""Insert Color Palette reference image and Brand Pattern section into index.html."""

import os

filepath = r'd:\Projects\Nuvexa\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert the color palette reference image before the closing of color section
color_palette_ref = '''
    <!-- Official Color Palette Reference -->
    <div class="section-header" style="margin-top: 64px; margin-bottom: 32px;">
      <span class="eyebrow">Official Reference</span>
      <p style="margin-top: 8px;">The definitive color palette reference card. Use this as the master reference for all brand color matching in print and digital applications.</p>
    </div>
    <div style="background: #fff; border: 1px solid var(--border); padding: 48px; display: flex; align-items: center; justify-content: center;">
      <img src="Color Palette/Color Palette.png" alt="Nuvexa Official Color Palette" style="max-width: 100%; height: auto;" />
    </div>
  </div>
</section>


<!-- ── BRAND PATTERN ──────────────────────────────────── -->
<section class="section" id="pattern">
  <div class="wrap">
    <div class="section-header">
      <span class="eyebrow">Brand Pattern</span>
      <h2>Visual Texture</h2>
      <p>The Nuvexa brand pattern is derived from the NU› logomark and the gold chevron motif. It serves as a proprietary visual texture for backgrounds, packaging, stationery, and environmental applications. Never use as a primary focal element — it supports, never dominates.</p>
    </div>

    <!-- Pattern 1 -->
    <div style="margin-bottom: 48px;">
      <div style="background: #fff; border: 1px solid var(--border); overflow: hidden; margin-bottom: 16px;">
        <img src="Nuvexa Brand Pattern/Brand-pattern-1.png" alt="Nuvexa Brand Pattern — Variant 1" style="width: 100%; height: auto; display: block;" />
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: var(--navy);">Pattern A — Primary</span>
        <span style="font-size: 13px; color: var(--steel);">Full density. For formal brand collateral, presentation covers, and environmental design.</span>
      </div>
    </div>

    <!-- Pattern 2 -->
    <div style="margin-bottom: 48px;">
      <div style="background: #fff; border: 1px solid var(--border); overflow: hidden; margin-bottom: 16px;">
        <img src="Nuvexa Brand Pattern/Brand-pattern-2.png" alt="Nuvexa Brand Pattern — Variant 2" style="width: 100%; height: auto; display: block;" />
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: var(--navy);">Pattern B — Alternate</span>
        <span style="font-size: 13px; color: var(--steel);">Offset variant. For secondary materials, digital backgrounds, and social media assets.</span>
      </div>
    </div>

    <!-- Pattern Usage Rules -->
    <div style="background: var(--navy); padding: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px;">
      <div>
        <p class="eyebrow" style="color: var(--gold); margin-bottom: 24px;">Pattern Usage Rules</p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px;">
          <li style="color: var(--cream); font-size: 15px; padding-left: 24px; position: relative;"><span style="position: absolute; left: 0; color: var(--gold); font-weight: 700;">&#x2192;</span> Always use at full resolution — never stretch or distort the pattern</li>
          <li style="color: var(--cream); font-size: 15px; padding-left: 24px; position: relative;"><span style="position: absolute; left: 0; color: var(--gold); font-weight: 700;">&#x2192;</span> Can be used at reduced opacity (10-30%) as a subtle background texture</li>
          <li style="color: var(--cream); font-size: 15px; padding-left: 24px; position: relative;"><span style="position: absolute; left: 0; color: var(--gold); font-weight: 700;">&#x2192;</span> Never recolor the pattern — always use the original Navy + Gold combination</li>
        </ul>
      </div>
      <div>
        <p class="eyebrow" style="color: var(--red); margin-bottom: 24px;">Applications</p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px;">
          <li style="color: var(--cream); font-size: 15px; padding-left: 24px; position: relative;"><span style="position: absolute; left: 0; color: var(--red); font-weight: 700;">&#x2192;</span> Business card reverse, letterhead watermark, proposal cover pages</li>
          <li style="color: var(--cream); font-size: 15px; padding-left: 24px; position: relative;"><span style="position: absolute; left: 0; color: var(--red); font-weight: 700;">&#x2192;</span> Presentation slide backgrounds (at 10-15% opacity)</li>
          <li style="color: var(--cream); font-size: 15px; padding-left: 24px; position: relative;"><span style="position: absolute; left: 0; color: var(--red); font-weight: 700;">&#x2192;</span> Environmental graphics: site hoardings, office interiors, signage accents</li>
        </ul>
      </div>
    </div>
  </div>
</section>'''

# Find the color palette section close and replace it
# Looking for the exact marker: closing </section> followed by Typography section
old_close = '  </div>\r\n</section>\r\n\r\n\r\n<!-- ── 04. TYPOGRAPHY'
new_close = color_palette_ref + '\r\n\r\n\r\n<!-- ── 04. TYPOGRAPHY'

if old_close in content:
    content = content.replace(old_close, new_close, 1)
    print("SUCCESS: Inserted color palette reference and brand pattern section.")
else:
    # Try with Unix line endings
    old_close_unix = old_close.replace('\r\n', '\n')
    if old_close_unix in content:
        content = content.replace(old_close_unix, new_close.replace('\r\n', '\n'), 1)
        print("SUCCESS (Unix LF): Inserted color palette reference and brand pattern section.")
    else:
        print("ERROR: Could not find insertion point.")
        print("Looking for: repr:", repr(old_close[:80]))
        # Search for nearby content
        idx = content.find('<!-- ── 04. TYPOGRAPHY')
        if idx >= 0:
            print(f"Found Typography at char {idx}")
            print(f"Context: {repr(content[idx-100:idx])}")
        exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(f"New total lines: {len(lines)}")
