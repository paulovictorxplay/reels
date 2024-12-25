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
        likeButton.innerHTML = '❤️ <span class="like-count" id="likeCount">0</span>';

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

        // Botão de comentário
        const commentButton = document.createElement('div');
        commentButton.classList.add('comment');
        commentButton.innerHTML = '💬 <span class="comment-count" id="commentCount">0</span>';
        commentButton.addEventListener('click', () => {
            commentsSection.style.display = 'block';
            commentButton.style.display = 'none';
        });

        // Botão de visualizações
        const viewButton = document.createElement('div');
        viewButton.classList.add('view');
        viewButton.innerHTML = '👁️ <span class="view-count" id="viewCount">0</span>';
        let viewCount = 0;
        let hasBeenViewed = false;

        // Contador de visualizações
        const incrementViewCount = () => {
            if (!hasBeenViewed) {
                hasBeenViewed = true;
                viewCount++;
                const viewCountDisplay = viewButton.querySelector('.view-count');
                viewCountDisplay.textContent = viewCount;
            }
        };

        // Seção de comentários
        const commentsSection = document.createElement('div');
        commentsSection.classList.add('comments-section');
        commentsSection.id = 'commentsSection';

        const commentInput = document.createElement('div');
        commentInput.classList.add('comment-input');
        commentInput.innerHTML = `
            <input type="text" id="commentInput" placeholder="Adicione um comentário..." />
            <button id="addCommentButton">Enviar</button>
        `;

        const commentsList = document.createElement('ul');
        commentsList.classList.add('comments-list');
        commentsList.id = 'commentsList';

        const closeCommentsButton = document.createElement('button');
        closeCommentsButton.classList.add('close-comments');
        closeCommentsButton.id = 'closeCommentsButton';
        closeCommentsButton.textContent = 'Fechar Comentários';
        closeCommentsButton.addEventListener('click', () => {
            commentsSection.style.display = 'none';
            commentButton.style.display = 'block';
        });

        commentsSection.appendChild(commentInput);
        commentsSection.appendChild(commentsList);
        commentsSection.appendChild(closeCommentsButton);

        // Evento de adicionar comentário
        const addCommentButton = commentInput.querySelector('#addCommentButton');
        addCommentButton.addEventListener('click', () => {
            const commentText = commentInput.querySelector('input').value.trim();
            if (commentText) {
                const newComment = document.createElement('li');
                newComment.textContent = commentText;
                commentsList.appendChild(newComment);
                commentInput.querySelector('input').value = '';
                const commentCount = commentButton.querySelector('.comment-count');
                commentCount.textContent = parseInt(commentCount.textContent) + 1;
            } else {
                alert('Por favor, digite um comentário!');
            }
        });

        bottomActions.appendChild(likeButton);
        bottomActions.appendChild(commentButton);
        bottomActions.appendChild(viewButton);

        videoContainer.appendChild(video);
        videoContainer.appendChild(bottomActions);
        videoContainer.appendChild(commentsSection);
        videoWrapper.appendChild(videoContainer);
    }

    const videos = document.querySelectorAll('video');

    // Configuração do Intersection Observer
    const observerOptions = {
        root: null,
        threshold: 0.8,
    };

    let activeVideo = null;

    const playVisibleVideo = (entries) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                if (activeVideo && activeVideo !== video) {
                    activeVideo.pause();
                }
                video.play();
                activeVideo = video;
                incrementViewCount(); // Incrementa a contagem de visualizações
            } else {
                video.pause();
            }
        });
    };

    const observer = new IntersectionObserver(playVisibleVideo, observerOptions);

    videos.forEach((video) => observer.observe(video));
});
