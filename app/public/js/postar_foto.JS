// script.js
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const previewContainerStep2 = document.getElementById('preview-container-step2');
    const advanceStep = document.getElementById('advance-step');
    const postButton = document.getElementById('post-button');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');

    let selectedFiles = [];

    fileInput.addEventListener('change', () => {
        Array.from(fileInput.files).forEach(file => {
            if (selectedFiles.length < 5) {
                selectedFiles.push(file);
                previewFile(file);
                return
            } else {
                alert('Você só pode escolher até 5 arquivos.');
            }
        });
        fileInput.value = ''; // Limpa o input para permitir re-seleção dos mesmos arquivos
    });

    function previewFile(file) {
        const reader = new FileReader();
        reader.onload = e => {
            const previewItem = document.createElement('section');
            previewItem.classList.add('preview-image-container');

            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-image');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', () => {
                selectedFiles = selectedFiles.filter(f => f !== file);
                previewContainer.removeChild(previewItem);
            });

            previewItem.appendChild(img);
            previewItem.appendChild(deleteButton);
            previewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    }

    advanceStep.addEventListener('click', () => {
        if (selectedFiles.length === 0) {
            alert('Por favor, escolha pelo menos um arquivo antes de avançar.');
            return;
        }

    console.log(fileInput.value);
        previewContainerStep2.innerHTML = previewContainer.innerHTML.replace(/<button class="delete-button">X<\/button>/g, '');
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    });

    postButton.addEventListener('click', () => {
        alert(`Publicação com título "${document.getElementById('title-input').value}" postada com sucesso!`);
    });
    
});

