document.addEventListener('DOMContentLoaded', () => {
    // Carrossel Artistas
    let currentIndexArtists = 0;

    function showSlideArtists(index) {
        const carouselArtists = document.querySelector('.grid-artists');
        const totalItemsArtists = document.querySelectorAll('.card-artists').length;
        const visibleItemsArtists = 5; // Número de itens visíveis

        if (index >= Math.ceil(totalItemsArtists / visibleItemsArtists)) {
            currentIndexArtists = 0;
        } else if (index < 0) {
            currentIndexArtists = Math.ceil(totalItemsArtists / visibleItemsArtists) - 1;
        } else {
            currentIndexArtists = index;
        }

        const offset = -currentIndexArtists * 100;
        if (carouselArtists) {
            carouselArtists.style.transform = `translateX(${offset}%)`;
        }
    }

    function nextSlideArtists() {
        showSlideArtists(currentIndexArtists + 1);
    }

    function prevSlideArtists() {
        showSlideArtists(currentIndexArtists - 1);
    }

    const nextButtonArtists = document.getElementById('next');
    const prevButtonArtists = document.getElementById('prev');

    if (nextButtonArtists && prevButtonArtists) {
        nextButtonArtists.addEventListener('click', nextSlideArtists);
        prevButtonArtists.addEventListener('click', prevSlideArtists);
    }

    showSlideArtists(currentIndexArtists);

    // Carrossel Beats
    const prevButtonGenero = document.querySelector('.prev-genero');
    const nextButtonGenero = document.querySelector('.next-genero');
    const carouselGenero = document.querySelector('.beats-grid-genero');

    if (prevButtonGenero && nextButtonGenero && carouselGenero) {
        prevButtonGenero.addEventListener('click', () => {
            carouselGenero.scrollBy({ left: -300, behavior: 'smooth' });
        });

        nextButtonGenero.addEventListener('click', () => {
            carouselGenero.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }


    // Upload da imagem de capa
    const coverImageUpload = document.getElementById('cover-image-upload');
    const coverImagePreview = document.getElementById('cover-image-preview');

    if (coverImageUpload && coverImagePreview) {
        coverImageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    coverImagePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const uploadForm = document.getElementById('upload-form-upload');
    const responseElement = document.getElementById('response');

    if (uploadForm && responseElement) {
        uploadForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php', true);

            xhr.onload = () => {
                if (xhr.status === 200) {
                    responseElement.innerHTML = xhr.responseText;
                } else {
                    responseElement.innerHTML = 'Ocorreu um erro!';
                }
            };

            xhr.send(formData);
        });
    }

    // Seleciona o input de arquivo do beat
    const beatFileUpload = document.getElementById('beat-file-upload');
    
    // Seleciona o elemento de áudio e a origem do áudio
    const audioPreview = document.getElementById('audio-preview-upload');
    const audioSource = document.getElementById('audio-source-upload');
    
    // Atualiza a prévia do áudio quando um arquivo é selecionado
    beatFileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const objectURL = URL.createObjectURL(file);
        audioSource.src = objectURL;
        audioPreview.load();
    });
});

 // Media Player
 const progress = document.getElementById("progress");
 const song = document.getElementById("song");
 const controllIcon = document.getElementById("controllIcon");
 const currentTime = document.querySelector(".current-time");
 const musicDuration = document.querySelector(".song-duration-time");
 const songName = document.getElementById("songName");
 const artistName = document.getElementById("artistName");

 const setMusic = (i) => {
     if (!progress || !song || !currentTime || !musicDuration || !songName || !artistName) return;

     progress.value = 0;
     let currentMusic = i;
     let songDetails = {
         path: "musictest/Drake - Push Ups_320kbps.mp3", // Caminho do arquivo de música
         title: "Push up", // Título da música
         artist: "Drake" // Nome do artista
     };

     song.src = songDetails.path;
     songName.innerHTML = songDetails.title;
     artistName.innerHTML = songDetails.artist;
     currentTime.innerHTML = '00:00';

     song.addEventListener('loadedmetadata', () => {
         progress.max = song.duration;
         musicDuration.innerHTML = formatTime(song.duration);
     });
 }

 setMusic(0);

 const formatTime = (seconds) => {
     const minutes = Math.floor(seconds / 60);
     const secs = Math.floor(seconds % 60);
     return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
 }

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

 if (song) {
     song.addEventListener('timeupdate', () => {
         progress.value = song.currentTime;
         currentTime.innerHTML = formatTime(song.currentTime);
     });
 }

 if (progress) {
     progress.addEventListener('input', () => {
         song.currentTime = progress.value;
     });
 }

 const volumeIcon = document.getElementById("volumeIcon");
 const volumeControl = document.getElementById("volume");

 if (volumeControl && volumeIcon) {
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
 }

function toggleMediaPlayer() {
    const musicPlayer = document.getElementById("musicPlayer");
    musicPlayer.style.display = musicPlayer.style.display === "none" ? "block" : "none";
}
