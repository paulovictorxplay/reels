document.addEventListener('DOMContentLoaded', async () => {
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

    for (let i = 0; i < videoLinks.length; i++) {
        const link = videoLinks[i];
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');

        const video = document.createElement('video');
        video.src = await fetchAndCreateBlobUrl(link);
        video.controls = true;
        video.muted = false;
        video.loop = true;

        // Botões
        const bottomActions = document.createElement('div');
        bottomActions.classList.add('bottom-actions');

        // Botão de Curtida
        const likeButton = document.createElement('div');
        likeButton.classList.add('like-button');
        likeButton.innerHTML = '❤️ <span class="like-count">0</span>';
        let liked = false;
        likeButton.addEventListener('click', () => {
            if (!liked) {
                liked = true;
                likeButton.classList.add('liked');
                const likeCount = likeButton.querySelector('.like-count');
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            }
        });

        // Botão de Visualização
        const viewButton = document.createElement('div');
        viewButton.classList.add('view');
        viewButton.innerHTML = '👁️ <span class="view-count">0</span>';
        let hasBeenViewed = false;
        const incrementViewCount = () => {
            if (!hasBeenViewed) {
                hasBeenViewed = true;
                const viewCount = viewButton.querySelector('.view-count');
                viewCount.textContent = parseInt(viewCount.textContent) + 1;
            }
        };

        bottomActions.appendChild(likeButton);
        bottomActions.appendChild(viewButton);
        videoContainer.appendChild(video);
        videoContainer.appendChild(bottomActions);
        videoWrapper.appendChild(videoContainer);

        // Observer para detectar visualizações
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        incrementViewCount();
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.8 }
        );
        observer.observe(video);
    }

    // Adicionar menu suspenso
    const menuButton = document.querySelector('.dropdown-button');
    const menuContent = document.querySelector('.dropdown-content');
    menuButton.addEventListener('click', () => {
        const isVisible = menuContent.style.display === 'block';
        menuContent.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !menuContent.contains(event.target)) {
            menuContent.style.display = 'none';
        }
    });
});


