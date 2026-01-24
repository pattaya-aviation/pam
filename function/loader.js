// Component Loader - โหลด HTML components เข้ามาใน page

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
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const scripts = tempDiv.querySelectorAll('script');
        const scriptContents = [];
        scripts.forEach(script => {
            scriptContents.push(script.textContent);
            script.remove();
        });
        
        document.getElementById(elementId).innerHTML = tempDiv.innerHTML;
        
        scriptContents.forEach(content => {
            const newScript = document.createElement('script');
            newScript.textContent = content;
            document.body.appendChild(newScript);
        });
        
    } catch (error) {
        console.error('Component load error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        loadComponent('navbar-placeholder', 'navbar');
    }
});
