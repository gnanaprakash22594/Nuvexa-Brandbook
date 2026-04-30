import os
import re

file_path = r"d:\Projects\Nuvexa\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Red/Orange Accent with Terracotta
content = content.replace("#F24E24", "#894029")
content = content.replace("rgba(242,78,36", "rgba(137,64,41")
content = content.replace("RGB 242 78 36", "RGB 137 64 41")
content = content.replace("Builder Orange-Red", "Builder Terracotta")

# Add Heritage Green to CSS variables
if "--green:  #045e53;" not in content:
    content = content.replace("--gold:   #C5A059;", "--gold:   #C5A059;\n      --green:  #045E53;")

# Add Heritage Green swatch to color palette section
green_swatch = """        <div class="swatch">
          <div class="swatch__color" style="background:#045E53;"></div>
          <div class="swatch__info">
            <h4>Campus Green</h4>
            <p class="hex">#045E53 &nbsp;&middot;&nbsp; RGB 4 94 83</p>
            <p class="role">Heritage and legacy. Used for secondary accents and depth. Connects the structural elements to the environment of an educational campus.</p>
          </div>
        </div>
"""

# Let's insert the green swatch next to Terracotta
if "#045E53" not in content[content.find("<h3>Accent Colors</h3>"):]:
    terracotta_swatch_end = content.find("</div>", content.find("Builder Terracotta")) + 6
    terracotta_swatch_end_div2 = content.find("</div>", terracotta_swatch_end) + 6
    
    # We'll just replace the swatches block for Accents
    # The Accents block looks like:
    # <h3>Accent Colors</h3>
    # <div class="swatches">
    #   <div class="swatch">...Gold...</div>
    #   <div class="swatch">...Terracotta...</div>
    # </div>
    
    # Actually, let's use regex to find the Accent Colors swatches div and append to it.
    import re
    # Find the Accent colors div
    match = re.search(r'(<h3>Accent Colors</h3>\s*<div class="swatches">)(.*?)(</div>\s*</div>)', content, re.DOTALL)
    if match:
        accent_swatches = match.group(2)
        if "Campus Green" not in accent_swatches:
            # Change grid-template-columns for this specific swatches div to 3 if there are 3 items
            content = content[:match.start()] + \
                      '<h3>Accent Colors</h3>\n      <div class="swatches" style="grid-template-columns: repeat(3, 1fr);">' + \
                      accent_swatches + green_swatch + match.group(3) + \
                      content[match.end():]

# Add Alternate Logo to Logo System
# The logo system has: Primary Wordmark, Logomark, Division Lockup
alternate_logo_html = """
    <!-- Alternate Logo -->
    <div class="logo-grid" style="grid-template-columns: 1fr;">
      <div class="logo-box logo-box--navy">
        <div class="logo-box__grid logo-box__grid--light"></div>
        <div class="logo-box__corner tl"></div>
        <div class="logo-box__corner tr"></div>
        <div class="logo-box__corner tm"></div>
        <div class="logo-box__corner bl"></div>
        <div class="logo-box__corner br"></div>
        <div class="logo-box__corner bm"></div>
        <div class="logo-box__guide-h top"></div>
        <div class="logo-box__guide-h bottom"></div>
        <div class="logo-box__guide-v left"></div>
        <div class="logo-box__guide-v right"></div>
        <div class="logo-box__guide-v mid"></div>
        <img class="logo-img" src="logo-cream-transparent.png" alt="Nuvexa Alternate Logo" />
        <span class="logo-box__tag">Alternate Logo</span>
      </div>
    </div>
"""

# Insert Alternate Logo after Primary Wordmark
if "Alternate Logo" not in content:
    primary_logo_end = content.find("<!-- Logomark -->")
    content = content[:primary_logo_end] + alternate_logo_html + "\n    " + content[primary_logo_end:]

# Update Guidelines text where it says "Never recolor the mark in Gold or Red"
content = content.replace("Gold or Red", "Gold, Terracotta, or Green")

# Also, update "Never pair Red and Gold" to "Never pair Terracotta and Gold"
content = content.replace("Never pair Red and Gold", "Never pair Terracotta and Gold")
content = content.replace("Red/#F24E24", "Terracotta/#894029")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Update complete.")
