// Component Loader - โหลด HTML components เข้ามาใน page

// หา base path จาก script src
function getBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.src.includes('loader.js')) {
            return script.src.replace('loader.js', '');
        }
    }
    return '';
}

const BASE_PATH = getBasePath();

async function loadComponent(elementId, componentName) {
    try {
        const componentPath = BASE_PATH + 'components/' + componentName + '.html';
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        
        // แยก HTML และ Script
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // เอา script ออกจาก HTML ก่อน
        const scripts = tempDiv.querySelectorAll('script');
        const scriptContents = [];
        scripts.forEach(script => {
            scriptContents.push(script.textContent);
            script.remove();
        });
        
        // ใส่ HTML ลงใน placeholder
        document.getElementById(elementId).innerHTML = tempDiv.innerHTML;
        
        // Execute scripts หลังจากใส่ HTML แล้ว
        scriptContents.forEach(content => {
            const newScript = document.createElement('script');
            newScript.textContent = content;
            document.body.appendChild(newScript);
        });
        
    } catch (error) {
        console.error('Component load error:', error);
    }
}

// Auto-load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        loadComponent('navbar-placeholder', 'navbar');
    }
});
