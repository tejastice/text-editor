class TextEditor {
    constructor() {
        this.textArea = document.getElementById('textEditor');
        this.newFileBtn = document.getElementById('newFile');
        this.saveFileBtn = document.getElementById('saveFile');
        this.openFileBtn = document.getElementById('openFile');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.newFileBtn.addEventListener('click', () => this.newFile());
        this.saveFileBtn.addEventListener('click', () => this.saveFile());
        this.openFileBtn.addEventListener('click', () => this.openFile());
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.newFile();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveFile();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.openFile();
                        break;
                }
            }
        });
    }

    newFile() {
        if (this.textArea.value && !confirm('現在の内容が失われます。よろしいですか？')) {
            return;
        }
        this.textArea.value = '';
        this.textArea.focus();
    }

    saveFile() {
        const content = this.textArea.value;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    openFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.textArea.value = e.target.result;
                };
                reader.readAsText(file);
            }
        });
        
        input.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TextEditor();
});