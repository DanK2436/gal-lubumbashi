import os
import re

def clean_conflict_markers(file_path):
    print(f"Cleaning {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to find conflict markers: <<<<<<< HEAD ... ======= ... >>>>>>> marker
        # We'll keep the HEAD version (between <<<<<<< HEAD and =======)
        # and discard the rest.
        
        pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======.*?>>>>>>> [a-f0-9]+', re.DOTALL)
        
        new_content = pattern.sub(r'\1', content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Successfully cleaned {file_path}")
        else:
            # Try a more generic pattern if HEAD is not there or markers are different
            pattern_generic = re.compile(r'<<<<<<<.*?\n(.*?)\n=======.*?>>>>>>>.*?\n', re.DOTALL)
            new_content = pattern_generic.sub(r'\1', content)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Successfully cleaned (generic) {file_path}")
            else:
                print(f"No conflict markers found or could not clean {file_path}")
                
    except Exception as e:
        print(f"Error cleaning {file_path}: {e}")

files_to_clean = [
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\css\utilities.css",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\css\components.css",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\css\home.css",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\js\chatbot.js",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\js\newsletter.js",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\js\pages\about.js",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\js\pages\contact.js",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\js\proverbes.js",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\js\test-projects-storage.js",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\js\test-supabase.js",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\_redirects",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\sitemap.xml",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\robots.txt",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\404.html",
    r"c:\Users\USER\Desktop\gal-lubumbashi-main\admin\debug.html"
]

for f in files_to_clean:
    if os.path.exists(f):
        clean_conflict_markers(f)
    else:
        print(f"File not found: {f}")
