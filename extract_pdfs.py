import subprocess, sys
try:
    import pdfplumber
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pdfplumber', '-q'])
    import pdfplumber
import os

folder = r'd:\Projects\Nuvexa'
for f in sorted(os.listdir(folder)):
    if f.endswith('.pdf'):
        print("\n" + "=" * 80)
        print("FILE: " + f)
        print("=" * 80)
        with pdfplumber.open(os.path.join(folder, f)) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    print("\n--- Page " + str(i + 1) + " ---")
                    print(text)
