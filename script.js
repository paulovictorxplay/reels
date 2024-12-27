document.addEventListener('DOMContentLoaded', async () => {
    // Links dos vídeos
    const videoLinks = [
        "https://res.cloudinary.com/ddcizz79j/video/upload/v1735074793/teste_reels_t7k7da.mp4",
        "https://res.cloudinary.com/ddcizz79j/video/upload/v1735075109/reels2_ztqvdo.mp4"
    ];

    const videoWrapper = document.getElementById('video-wrapper');

    // Função para converter um link para Blob URL
    const fetchAndCreateBlobUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    // Criar vídeos dinamicamente com blobs
    for (let i = 0; i < videoLinks.length; i++) {
        const link = videoLinks[i];
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');

        const video = document.createElement('video');
        video.src = await fetchAndCreateBlobUrl(link); // Gera o Blob URL
        video.controls = true;
        video.muted = false;
        video.loop = true;

        // Adicionar botões de like, comentário e visualizações
        const bottomActions = document.createElement('div');
        bottomActions.classList.add('bottom-actions');

        // Botão de like
        const likeButton = document.createElement('div');
        likeButton.classList.add('like-button');
        likeButton.innerHTML = '❤️ <span class="like-count">0</span>';

        // Adicionar evento de curtir
        let liked = false;
        likeButton.addEventListener('click', () => {
            if (!liked) {
                liked = true;
                likeButton.classList.add('liked');
                const likeCount = likeButton.querySelector('.like-count');
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            }
        });

        // Botão de visualizações
        const viewButton = document.createElement('div');
        viewButton.classList.add('view');
        viewButton.innerHTML = '👁️ <span class="view-count">0</span>';
        let hasBeenViewed = false;

        const incrementViewCount = () => {
            if (!hasBeenViewed) {
                hasBeenViewed = true;
                const viewCountDisplay = viewButton.querySelector('.view-count');
                viewCountDisplay.textContent = parseInt(viewCountDisplay.textContent) + 1;
            }
        };

        bottomActions.appendChild(likeButton);
        bottomActions.appendChild(viewButton);

        videoContainer.appendChild(video);
        videoContainer.appendChild(bottomActions);
        videoWrapper.appendChild(videoContainer);

        // Configurar observador para incrementar visualizações
        const observerOptions = {
            root: null,
            threshold: 0.8,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play();
                    incrementViewCount();
                } else {
                    video.pause();
                }
            });
        }, observerOptions);

        observer.observe(video);
    }
});

// Menu suspenso
document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownButton.addEventListener('click', () => {
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    });

    // Fechar o menu ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });
});

// Função para abrir a página de músicas
function openMusic() {
    const musicUrl = "https://suaurl.com/musicas"; // Substitua pela sua URL
    window.open(musicUrl, "_blank"); // Abre em uma nova aba
}
