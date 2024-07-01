document.addEventListener('DOMContentLoaded', () => {
    let currentIndexArtists = 0;

    // Carrossel Artistas
    function showSlideArtists(index) {
        const carouselArtists = document.querySelector('.grid-artists');
        const totalItemsArtists = document.querySelectorAll('.card-artists').length;
        const visibleItemsArtists = 5; // Número de itens visíveis

        // Verifica se o índice está fora dos limites e ajusta o índice atual
        if (index >= Math.ceil(totalItemsArtists / visibleItemsArtists)) {
            currentIndexArtists = 0;
        } else if (index < 0) {
            currentIndexArtists = Math.ceil(totalItemsArtists / visibleItemsArtists) - 1;
        } else {
            currentIndexArtists = index;
        }

        // Calcula o deslocamento para o carrossel e aplica a transformação
        const offset = -currentIndexArtists * 100;
        carouselArtists.style.transform = `translateX(${offset}%)`;
    }

    function nextSlideArtists() {
        showSlideArtists(currentIndexArtists + 1);
    }

    function prevSlideArtists() {
        showSlideArtists(currentIndexArtists - 1);
    }

    // Adiciona eventos de clique aos botões "next" e "prev"
    document.getElementById('next').addEventListener('click', nextSlideArtists);
    document.getElementById('prev').addEventListener('click', prevSlideArtists);

    // Exibe o slide inicial
    showSlideArtists(currentIndexArtists);

    // Carrossel Beats
    const prevButtonGenero = document.querySelector('.prev-genero');
    const nextButtonGenero = document.querySelector('.next-genero');
    const carouselGenero = document.querySelector('.beats-grid-genero');

    // Adiciona eventos de clique aos botões para rolar o carrossel de beats
    prevButtonGenero.addEventListener('click', () => {
        carouselGenero.scrollBy({
            left: -300, // Ajuste a quantidade de rolagem conforme necessário
            behavior: 'smooth'
        });
    });

    nextButtonGenero.addEventListener('click', () => {
        carouselGenero.scrollBy({
            left: 300, // Ajuste a quantidade de rolagem conforme necessário
            behavior: 'smooth'
        });
    });
});

// Media Player com Div Flutuante
let progress = document.getElementById("progress");
let song = document.getElementById("song");
let controllIcon = document.getElementById("controllIcon");
const currentTime = document.querySelector(".current-time");
const musicDuration = document.querySelector(".song-duration-time");
const songName = document.getElementById("songName");
const artistName = document.getElementById("artistName");

const setMusic = (i) => {
    progress.value = 0;
    let currentMusic = i;
    let songDetails = {
        path: "musictest/Drake - Push Ups_320kbps.mp3", // Caminho do arquivo de música
        title: "Push up", // Título da música
        artist: "Drake" // Nome do artista
    };

    // Define a fonte do arquivo de música e atualiza as informações da música
    song.src = songDetails.path;
    songName.innerHTML = songDetails.title;
    artistName.innerHTML = songDetails.artist;
    currentTime.innerHTML = '00:00';

    // Atualiza a duração da música quando os metadados são carregados
    song.addEventListener('loadedmetadata', () => {
        progress.max = song.duration;
        musicDuration.innerHTML = formatTime(song.duration);
    });
}

setMusic(0); // Define a primeira música

// Formata o tempo em minutos e segundos
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Função para tocar/pausar a música
const playPause = () => {
    if (song.paused) {
        song.play();
        controllIcon.classList.remove('fa-play');
        controllIcon.classList.add('fa-pause');
    } else {
        song.pause();
        controllIcon.classList.remove('fa-pause');
        controllIcon.classList.add('fa-play');
    }
}

// Atualiza o tempo atual e o progresso da música
song.addEventListener('timeupdate', () => {
    progress.value = song.currentTime;
    currentTime.innerHTML = formatTime(song.currentTime);
});

// Permite que o usuário pule para diferentes partes da música
progress.addEventListener('input', () => {
    song.currentTime = progress.value;
});

// Atualiza a duração da música quando os metadados são carregados
song.addEventListener('loadedmetadata', () => {
    progress.max = song.duration;
    musicDuration.innerHTML = formatTime(song.duration);
});

// Controle de Volume com Animação de Ícone
const volumeIcon = document.getElementById("volumeIcon");
const volumeControl = document.getElementById("volume");

volumeControl.addEventListener('input', () => {
    const volumeValue = volumeControl.value;
    song.volume = volumeValue / 100;

    if (volumeValue == 0) {
        volumeIcon.classList.remove('fa-volume-low', 'fa-volume-high');
        volumeIcon.classList.add('fa-volume-off');
    } else if (volumeValue <= 50) {
        volumeIcon.classList.remove('fa-volume-off', 'fa-volume-high');
        volumeIcon.classList.add('fa-volume-low');
    } else {
        volumeIcon.classList.remove('fa-volume-off', 'fa-volume-low');
        volumeIcon.classList.add('fa-volume-high');
    }
});

function toggleMediaPlayer() {
    const musicPlayer = document.getElementById("musicPlayer");
    musicPlayer.style.display = musicPlayer.style.display === "none" ? "block" : "none";
}

// Upload de Imagem
document.getElementById('cover-image-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('cover-image-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Formulário de Upload
document.getElementById('upload-form-upload').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php', true);

    xhr.onload = () => {
        const responseElement = document.getElementById('response');
        if (xhr.status === 200) {
            responseElement.innerHTML = xhr.responseText;
        } else {
            responseElement.innerHTML = 'Ocorreu um erro!';
        }
    };

    xhr.send(formData);
});