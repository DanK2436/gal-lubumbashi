const fs = require('fs');
const path = require('path');

const filesToClean = [
    "css/utilities.css",
    "css/components.css",
    "css/home.css",
    "js/chatbot.js",
    "js/newsletter.js",
    "js/pages/about.js",
    "js/pages/contact.js",
    "js/proverbes.js",
    "js/test-projects-storage.js",
    "js/test-supabase.js",
    "_redirects",
    "sitemap.xml",
    "robots.txt",
    "404.html",
    "admin/debug.html"
];

function cleanConflictMarkers(filePath) {
    const absolutePath = path.resolve("c:/Users/USER/Desktop/gal-lubumbashi-main", filePath);
    console.log(`Cleaning ${absolutePath}...`);

    if (!fs.existsSync(absolutePath)) {
        console.warn(`File not found: ${absolutePath}`);
        return;
    }

    try {
        let content = fs.readFileSync(absolutePath, 'utf8');

        // Match <<<<<<< HEAD ... ======= ... >>>>>>> [hex]
        const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>> [a-f0-9]+/g;

        let newContent = content.replace(regex, (match, head) => {
            console.log(`Found markers in ${filePath}, keeping HEAD version.`);
            return head;
        });

        // Generic fallback if HEAD is missing or markers different
        const genericRegex = /<<<<<<<.*?\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>>.*/g;
        newContent = newContent.replace(genericRegex, (match, branch1) => {
            console.log(`Found generic markers in ${filePath}, keeping first version.`);
            return branch1;
        });

        if (newContent !== content) {
            fs.writeFileSync(absolutePath, newContent, 'utf8');
            console.log(`Successfully cleaned ${filePath}`);
        } else {
            console.log(`No conflict markers found in ${filePath}`);
        }
    } catch (error) {
        console.error(`Error cleaning ${filePath}:`, error);
    }
}

filesToClean.forEach(cleanConflictMarkers);
