document.addEventListener('DOMContentLoaded', () => {
    // Animation Matrix Background
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const matrixBg = document.getElementById('matrix-bg');
    matrixBg.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0891b2';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    // Animation des éléments flottants
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(element => {
        animateFloat(element);
    });

    // Animation d'entrée
    const fadeLeftElements = document.querySelectorAll('.fade-in-left');
    const fadeRightElements = document.querySelectorAll('.fade-in-right');

    fadeLeftElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        setTimeout(() => {
            element.style.transition = 'all 1s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 300);
    });

    fadeRightElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        setTimeout(() => {
            element.style.transition = 'all 1s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 300);
    });

    // Configuration améliorée de l'éditeur Ace
    const editor = ace.edit("editor");
    
    // Chargement des modules nécessaires
    ace.require("ace/ext/language_tools");
    
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showPrintMargin: false,
        fontSize: "14px",
        tabSize: 2,
        wrap: true,
        showGutter: true,
        theme: "ace/theme/monokai",
        mode: "ace/mode/javascript",
        readOnly: false,
        highlightActiveLine: true,
        displayIndentGuides: true,
        scrollPastEnd: 0.5,
        cursorStyle: 'ace',
        behavioursEnabled: true,
        wrapBehavioursEnabled: true
    });

    // Ajoutez ces styles CSS pour s'assurer que l'éditeur est visible et interactif
    const additionalStyles = `
        #editor {
            position: relative;
            width: 100%;
            height: 400px;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .ace_editor {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
            background-color: #1e293b !important;
        }
        
        .ace_gutter {
            background-color: #1e293b !important;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = additionalStyles;
    document.head.appendChild(styleSheet);

    // Définir une valeur initiale
    editor.setValue(`// Écrivez votre code ici
function exemple() {
    const message = "Hello World!";
    console.log(message);
    return message;
}`);

    // Placer le curseur à la fin
    editor.clearSelection();
    editor.moveCursorTo(0, 0);

    // Gestion du changement de thème
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', (e) => {
        editor.setTheme(`ace/theme/${e.target.value}`);
    });

    // Mise à jour des compteurs
    function updateCounters() {
        const content = editor.getValue();
        const lineCount = editor.session.getLength();
        const charCount = content.length;
        
        document.getElementById('lineCount').textContent = `${lineCount} ligne${lineCount > 1 ? 's' : ''}`;
        document.getElementById('charCount').textContent = `${charCount} caractère${charCount > 1 ? 's' : ''}`;
    }

    editor.session.on('change', updateCounters);

    // Gestion du changement de langage
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', (e) => {
        editor.session.setMode(`ace/mode/${e.target.value}`);
        
        // Exemples de code par défaut pour chaque langage
        const defaultCode = {
            javascript: `// Exemple JavaScript
function exemple() {
    const message = "Hello World!";
    console.log(message);
    return message;
}`,
            typescript: `// Exemple TypeScript
interface Message {
    text: string;
    timestamp: Date;
}

function exemple(): Message {
    const message: Message = {
        text: "Hello World!",
        timestamp: new Date()
    };
    console.log(message.text);
    return message;
}`,
            python: `# Exemple Python
def exemple():
    message = "Hello World!"
    print(message)
    return message`,
            html: `<!-- Exemple HTML -->
<div class="container">
    <h1>Hello World!</h1>
    <p>Bienvenue sur notre site</p>
</div>`,
            css: `/* Exemple CSS */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`,
            php: `<?php
// Exemple PHP
function exemple() {
    $message = "Hello World!";
    echo $message;
    return $message;
}`
        };

        editor.setValue(defaultCode[e.target.value] || '', -1);
    });

    // Copier le code
    document.getElementById('copyCode').addEventListener('click', () => {
        const code = editor.getValue();
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('copyCode');
            btn.textContent = 'Copié !';
            btn.classList.add('bg-green-600');
            setTimeout(() => {
                btn.textContent = 'Copier';
                btn.classList.remove('bg-green-600');
            }, 2000);
        });
    });

    // Effacer le code
    document.getElementById('clearCode').addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment effacer tout le code ?')) {
            editor.setValue('', -1);
        }
    });

    // Sauvegarde automatique dans le localStorage
    const STORAGE_KEY = 'savedCode';
    
    // Restaurer le code sauvegardé
    const savedCode = localStorage.getItem(STORAGE_KEY);
    if (savedCode) {
        editor.setValue(savedCode, -1);
    }

    // Sauvegarder automatiquement
    editor.session.on('change', () => {
        localStorage.setItem(STORAGE_KEY, editor.getValue());
    });

    // Gestionnaire d'événements pour les boutons d'export
    document.getElementById('exportPNG').addEventListener('click', () => exportAsImage('png'));
    document.getElementById('exportJPG').addEventListener('click', () => exportAsImage('jpg'));

    // Gestion du bouton de partage
    const shareButton = document.getElementById('shareCode');
    shareButton.addEventListener('click', async () => {
        const code = editor.getValue();
        const language = languageSelect.value;
        const theme = themeSelect.value;
        const shareURL = generateShareURL(code, language, theme);

        const copied = await copyToClipboard(shareURL);
        
        if (copied) {
            const icon = shareButton.querySelector('i');
            const originalIcon = icon.className;
            icon.className = 'fas fa-check';
            shareButton.textContent = 'URL Copiée !';
            shareButton.prepend(icon);
            shareButton.classList.add('bg-purple-600');
            
            setTimeout(() => {
                icon.className = originalIcon;
                shareButton.textContent = 'Partager URL';
                shareButton.prepend(icon);
                shareButton.classList.remove('bg-purple-600');
            }, 2000);
        } else {
            alert('Erreur lors de la copie de l\'URL');
        }
    });

    // Vérifier s'il y a des paramètres dans l'URL au chargement
    const urlParams = new URLSearchParams(window.location.search);
    const encodedCode = urlParams.get('code');
    const language = urlParams.get('lang');
    const theme = urlParams.get('theme');

    if (encodedCode) {
        const decodedCode = decodeCode(encodedCode);
        if (decodedCode) {
            editor.setValue(decodedCode, -1);
        }
    }

    if (language && languageSelect.querySelector(`option[value="${language}"]`)) {
        languageSelect.value = language;
        editor.session.setMode(`ace/mode/${language}`);
    }

    if (theme && themeSelect.querySelector(`option[value="${theme}"]`)) {
        themeSelect.value = theme;
        editor.setTheme(`ace/theme/${theme}`);
    }

    // Gestion de la modale des raccourcis
    const shortcutsModal = document.getElementById('shortcutsModal');
    const shortcutsBtn = document.getElementById('shortcutsBtn');
    const closeShortcuts = document.getElementById('closeShortcuts');

    function toggleShortcutsModal() {
        shortcutsModal.classList.toggle('hidden');
    }

    shortcutsBtn.addEventListener('click', toggleShortcutsModal);
    closeShortcuts.addEventListener('click', toggleShortcutsModal);

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !shortcutsModal.classList.contains('hidden')) {
            toggleShortcutsModal();
        }
        // Ouvrir avec Ctrl + H
        if (e.ctrlKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            toggleShortcutsModal();
        }
    });

    // Fermer en cliquant en dehors de la modale
    shortcutsModal.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) {
            toggleShortcutsModal();
        }
    });

    // Ajoutez ce code pour gérer les onglets
    class Tab {
        constructor(id, name, language, content = '') {
            this.id = id;
            this.name = name;
            this.language = language;
            this.content = content;
        }
    }

    // État global des onglets
    const tabState = {
        tabs: [],
        activeTab: null
    };

    // Initialisation des onglets
    function initTabs() {
        const tabsContainer = document.getElementById('tabs-container');
        const addTabButton = document.getElementById('addTab');

        // Créer le premier onglet par défaut
        createNewTab();

        // Gestionnaire pour ajouter un nouvel onglet
        addTabButton.addEventListener('click', () => {
            createNewTab();
        });
    }

    // Créer un nouvel onglet
    function createNewTab() {
        const id = `tab-${Date.now()}`;
        const defaultName = `script${tabState.tabs.length + 1}.js`;
        
        // Déterminer le langage en fonction de l'extension
        const extension = defaultName.split('.').pop().toLowerCase();
        const languageMap = {
            'js': 'javascript',
            'ts': 'typescript',
            'html': 'html',
            'css': 'css',
            'py': 'python',
            'php': 'php',
            'jsx': 'javascript',
            'tsx': 'typescript',
            'vue': 'html',
            'scss': 'css',
            'less': 'css'
        };
        
        const language = languageMap[extension] || 'javascript';
        const newTab = new Tab(id, defaultName, language, '// Votre code ici');
        
        tabState.tabs.push(newTab);
        renderTab(newTab);
        switchToTab(newTab.id);
    }

    // Rendu d'un onglet
    function renderTab(tab) {
        const tabsContainer = document.getElementById('tabs-container');
        const tabElement = document.createElement('div');
        tabElement.className = `group flex items-center bg-slate-800 rounded-t-lg px-4 py-2 cursor-pointer ${
            tabState.activeTab === tab.id ? 'text-cyan-400 border-t-2 border-cyan-400' : 'text-gray-400'
        }`;
        tabElement.id = tab.id;

        // Déterminer l'icône en fonction de l'extension du fichier
        const fileIcon = getFileIcon(tab.name);

        tabElement.innerHTML = `
            <i class="${fileIcon} text-sm mr-2"></i>
            <span class="tab-name" contenteditable="true">${tab.name}</span>
            <button class="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Gestionnaire de clic sur l'onglet
        tabElement.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                switchToTab(tab.id);
            }
        });

        // Gestionnaire pour le renommage
        const nameElement = tabElement.querySelector('.tab-name');
        nameElement.addEventListener('blur', () => {
            const newName = nameElement.textContent;
            tab.name = newName;
            updateTabIcon(tabElement, newName);
            
            // Mettre à jour le mode de l'éditeur si c'est l'onglet actif
            if (tabState.activeTab === tab.id) {
                const extension = newName.split('.').pop().toLowerCase();
                const languageMap = {
                    'js': 'javascript',
                    'ts': 'typescript',
                    'html': 'html',
                    'css': 'css',
                    'py': 'python',
                    'php': 'php'
                };
                const newLanguage = languageMap[extension];
                if (newLanguage) {
                    tab.language = newLanguage;
                    editor.session.setMode(`ace/mode/${newLanguage}`);
                    document.getElementById('languageSelect').value = newLanguage;
                }
            }
        });

        // Gestionnaire pour la suppression
        const closeButton = tabElement.querySelector('button');
        closeButton.addEventListener('click', () => {
            removeTab(tab.id);
        });

        tabsContainer.appendChild(tabElement);
    }

    // Changer d'onglet
    function switchToTab(tabId) {
        const tab = tabState.tabs.find(t => t.id === tabId);
        if (!tab) return;

        // Sauvegarder le contenu de l'onglet actif
        if (tabState.activeTab) {
            const oldTab = tabState.tabs.find(t => t.id === tabState.activeTab);
            if (oldTab) {
                oldTab.content = editor.getValue();
            }
        }

        // Mettre à jour l'interface
        document.querySelectorAll('#tabs-container > div').forEach(el => {
            el.classList.toggle('text-cyan-400', el.id === tabId);
            el.classList.toggle('border-t-2', el.id === tabId);
            el.classList.toggle('border-cyan-400', el.id === tabId);
        });

        // Charger le nouveau contenu
        editor.session.setMode(`ace/mode/${tab.language}`);
        editor.setValue(tab.content, -1);
        document.getElementById('languageSelect').value = tab.language;

        tabState.activeTab = tabId;
    }

    // Supprimer un onglet
    function removeTab(tabId) {
        if (tabState.tabs.length === 1) {
            alert('Vous ne pouvez pas supprimer le dernier onglet');
            return;
        }

        const index = tabState.tabs.findIndex(t => t.id === tabId);
        if (index === -1) return;

        tabState.tabs.splice(index, 1);
        document.getElementById(tabId).remove();

        // Si on supprime l'onglet actif, switch vers un autre
        if (tabState.activeTab === tabId) {
            const newTab = tabState.tabs[Math.max(0, index - 1)];
            switchToTab(newTab.id);
        }
    }

    // Modifier le gestionnaire de changement de langage
    languageSelect.addEventListener('change', (e) => {
        const currentTab = tabState.tabs.find(t => t.id === tabState.activeTab);
        if (currentTab) {
            currentTab.language = e.target.value;
            editor.session.setMode(`ace/mode/${e.target.value}`);
        }
    });

    // Initialiser les onglets au chargement
    initTabs();
});

// Ajoutez ces styles dans une balise style dans votre head ou dans un fichier CSS séparé
const styles = `
    .code-editor-container {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    #editor {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    }
    
    .export-ready {
        border: none !important;
        box-shadow: none !important;
    }
    
    select, button {
        outline: none !important;
    }
    
    select:focus, button:focus {
        ring: 2px solid rgba(14, 165, 233, 0.5);
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function animateFloat(element) {
    const randomX = Math.random() * 20 - 10;
    const randomY = Math.random() * 20 - 10;
    const randomDuration = 3000 + Math.random() * 2000;

    element.animate([
        { transform: 'translate(0, 0) rotate(0deg)' },
        { transform: `translate(${randomX}px, ${randomY}px) rotate(${randomX/2}deg)` },
        { transform: 'translate(0, 0) rotate(0deg)' }
    ], {
        duration: randomDuration,
        iterations: Infinity,
        easing: 'ease-in-out'
    });
}

// Animation des icônes tech
document.querySelectorAll('.tech-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
    });
});

// Ajoutez cette fonction qui manquait pour l'export d'image
async function exportAsImage(format) {
    const editorElement = document.querySelector('.code-editor-container');
    
    try {
        const canvas = await html2canvas(editorElement, {
            backgroundColor: getComputedStyle(editorElement).backgroundColor,
            scale: 2,
            logging: false,
            useCORS: true
        });

        // Création du lien de téléchargement
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0,10);
        link.download = `code-export-${timestamp}.${format}`;
        
        if (format === 'png') {
            link.href = canvas.toDataURL('image/png');
        } else {
            link.href = canvas.toDataURL('image/jpeg', 0.9);
        }
        
        link.click();
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        alert('Une erreur est survenue lors de l\'export');
    }
}

// Ajoutez ces fonctions pour la gestion du partage par URL
function encodeCode(code) {
    return btoa(encodeURIComponent(code));
}

function decodeCode(encoded) {
    try {
        return decodeURIComponent(atob(encoded));
    } catch (e) {
        console.error('Erreur de décodage:', e);
        return null;
    }
}

function generateShareURL(code, language, theme) {
    const baseURL = window.location.origin + window.location.pathname;
    const encodedCode = encodeCode(code);
    return `${baseURL}?code=${encodedCode}&lang=${language}&theme=${theme}`;
}

function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

// Ajoutez cette fonction pour déterminer l'icône appropriée
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const iconMap = {
        'js': 'fab fa-js text-yellow-400',
        'ts': 'fab fa-js text-blue-400',
        'html': 'fab fa-html5 text-orange-400',
        'css': 'fab fa-css3-alt text-blue-500',
        'py': 'fab fa-python text-blue-400',
        'php': 'fab fa-php text-indigo-400',
        'json': 'fas fa-code text-gray-400',
        'md': 'fas fa-file-alt text-gray-400',
        'txt': 'fas fa-file-alt text-gray-400',
        'jsx': 'fab fa-react text-cyan-400',
        'tsx': 'fab fa-react text-blue-400',
        'vue': 'fab fa-vuejs text-green-400',
        'scss': 'fab fa-sass text-pink-400',
        'less': 'fab fa-less text-blue-400',
        'sql': 'fas fa-database text-gray-400',
        'xml': 'fas fa-code text-orange-400',
        'yaml': 'fas fa-file-code text-red-400',
        'yml': 'fas fa-file-code text-red-400',
        'sh': 'fas fa-terminal text-green-400',
        'bash': 'fas fa-terminal text-green-400',
        'go': 'fas fa-code text-cyan-400',
        'java': 'fab fa-java text-red-400',
        'rb': 'fas fa-gem text-red-400',
        'rust': 'fas fa-cog text-orange-400',
        'c': 'fas fa-code text-blue-400',
        'cpp': 'fas fa-code text-blue-500',
        'cs': 'fas fa-code text-purple-400'
    };

    return iconMap[extension] || 'fas fa-file-code text-gray-400';
}

// Ajoutez un gestionnaire pour mettre à jour l'icône lors du renommage
function updateTabIcon(tabElement, newName) {
    const iconElement = tabElement.querySelector('i:first-child');
    const newIcon = getFileIcon(newName);
    iconElement.className = newIcon;
}