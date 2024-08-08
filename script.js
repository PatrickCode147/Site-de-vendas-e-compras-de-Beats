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

    // Seleciona o input de arquivo do beat
    const beatFileUpload = document.getElementById('beat-file-upload');
    const audioPreview = document.getElementById('audio-preview-upload');
    const audioSource = document.getElementById('audio-source-upload');

    if (beatFileUpload && audioPreview && audioSource) {
        beatFileUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const objectURL = URL.createObjectURL(file);
                audioSource.src = objectURL;
                audioPreview.load();
            }
        });
    }

    // Media Player
    const progress = document.getElementById("progress");
    const song = document.getElementById("song");
    const controllIcon = document.getElementById("controllIcon");
    const currentTime = document.querySelector(".current-time");
    const musicDuration = document.querySelector(".song-duration-time");
    const songName = document.getElementById("songName");
    const artistName = document.getElementById("artistName");
    const coverImage = document.getElementById("coverImage");
    const volumeIcon = document.getElementById("volumeIcon");
    const volumeControl = document.getElementById("volume");

    if (!progress || !song || !controllIcon || !currentTime || !musicDuration || !songName || !artistName || !coverImage || !volumeIcon || !volumeControl) {
        console.error('One or more elements not found in the DOM');
        console.log({
            progress,
            song,
            controllIcon,
            currentTime,
            musicDuration,
            songName,
            artistName,
            coverImage,
            volumeIcon,
            volumeControl
        });
        return;
    }

    const setMusic = (musicData) => {
        progress.value = 0;

        song.src = musicData.audio_path;
        coverImage.src = musicData.cover_image_path;
        songName.innerHTML = musicData.beat_name;
        artistName.innerHTML = musicData.artist_name; // Assuming you have artist_name in your musicData
        currentTime.innerHTML = '00:00';

        song.addEventListener('loadedmetadata', () => {
            progress.max = song.duration;
            musicDuration.innerHTML = formatTime(song.duration);
        });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

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
    };

    song.addEventListener('timeupdate', () => {
        progress.value = song.currentTime;
        currentTime.innerHTML = formatTime(song.currentTime);
    });

    progress.addEventListener('input', () => {
        song.currentTime = progress.value;
    });

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

    const toggleMediaPlayer = () => {
        const musicPlayer = document.getElementById("musicPlayer");
        if (musicPlayer) {
            musicPlayer.style.display = musicPlayer.style.display === "none" ? "block" : "none";
        }
    };

    // Attach toggleMediaPlayer function to the global scope
    window.toggleMediaPlayer = toggleMediaPlayer;

    // Fetch data from the server
    fetch('path_to_your_php_file.php')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                setMusic(data[0]); // Assuming the first beat
                document.getElementById("musicPlayer").style.display = 'block';
            } else {
                console.error('No music data found');
            }
        })
        .catch(error => console.error('Error fetching music data:', error));
});
