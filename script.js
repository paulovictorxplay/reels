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
        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);  // Verifique o URL gerado no console
        return blobUrl;
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

        // Botão de comentário
        const commentButton = document.createElement('div');
        commentButton.classList.add('comment');
        commentButton.innerHTML = '💬 <span class="comment-count">0</span>';
        commentButton.addEventListener('click', () => {
            commentsSection.style.display = 'block';
            commentButton.style.display = 'none';
        });

        const commentsSection = document.createElement('div');
        commentsSection.classList.add('comments-section');
        commentsSection.id = 'commentsSection';

        const commentInput = document.createElement('div');
        commentInput.classList.add('comment-input');
        commentInput.innerHTML = `
            <input type="text" placeholder="Adicione um comentário..." />
            <button>Enviar</button>
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

        const addCommentButton = commentInput.querySelector('button');
        const commentInputField = commentInput.querySelector('input');

        addCommentButton.addEventListener('click', () => {
            const commentText = commentInputField.value.trim();
            if (commentText) {
                const newComment = document.createElement('li');
                newComment.textContent = commentText;
                commentsList.appendChild(newComment);
                commentInputField.value = '';
                const commentCount = commentButton.querySelector('.comment-count');
                commentCount.textContent = parseInt(commentCount.textContent) + 1;
            } else {
                alert('Por favor, digite um comentário!');
            }
        });

        // Botão de visualizações
        const viewButton = document.createElement('div');
        viewButton.classList.add('view');
        viewButton.innerHTML = '👁️ <span class="view-count">0</span>';
        let hasBeenViewed = false;

        const incrementViewCount = async () => {
            if (!hasBeenViewed) {
                hasBeenViewed = true;
                const videoId = `video_${i + 1}`;
                const videoRef = doc(db, "videos", videoId);
                
                const videoDoc = await getDoc(videoRef);
                if (videoDoc.exists()) {
                    await updateDoc(videoRef, {
                        views: increment(1)
                    });
                } else {
                    await setDoc(videoRef, { views: 1 });
                }

                // Atualiza o contador local
                const viewCountDisplay = viewButton.querySelector('.view-count');
                viewCountDisplay.textContent = parseInt(viewCountDisplay.textContent) + 1;
            }
        };

        bottomActions.appendChild(likeButton);
        bottomActions.appendChild(commentButton);
        bottomActions.appendChild(viewButton);

        videoContainer.appendChild(video);
        videoContainer.appendChild(bottomActions);
        videoContainer.appendChild(commentsSection);
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
                    incrementViewCount(); // Incrementa visualização no Firestore
                } else {
                    video.pause();
                }
            });
        }, observerOptions);

        observer.observe(video);
    }
});

import { getDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase-config"; // Certifique-se de que está importando corretamente o Firestore

// Função para incrementar visualizações
const incrementViewCount = async () => {
    const userRef = doc(db, "usuario", "Eaumi1HIRIfPbbdrwJnD"); // Substitua pelo caminho do documento correto

    try {
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Incrementa a contagem de visualizações
            await updateDoc(userRef, {
                views: increment(1)
            });
            console.log("Visualização registrada!");
        } else {
            // Cria o documento caso ele não exista
            await setDoc(userRef, {
                views: 1,
                likes: 0,
                comments: []
            });
            console.log("Documento criado e visualização registrada!");
        }
    } catch (error) {
        console.error("Erro ao registrar visualização:", error);
    }
};


