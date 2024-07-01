document.addEventListener('DOMContentLoaded', () => {
    let currentIndexArtists = 0;

    // Carrossel Artistas
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
        carouselArtists.style.transform = `translateX(${offset}%)`;
    }

    function nextSlideArtists() {
        showSlideArtists(currentIndexArtists + 1);
    }

    function prevSlideArtists() {
        showSlideArtists(currentIndexArtists - 1);
    }

    document.getElementById('next').addEventListener('click', nextSlideArtists);
    document.getElementById('prev').addEventListener('click', prevSlideArtists);

    showSlideArtists(currentIndexArtists);

    // Carrossel Beats
    const prevButtonGenero = document.querySelector('.prev-genero');
    const nextButtonGenero = document.querySelector('.next-genero');
    const carouselGenero = document.querySelector('.beats-grid-genero');

    prevButtonGenero.addEventListener('click', () => {
        carouselGenero.scrollBy({
            left: -300, // Ajuste conforme necessário
            behavior: 'smooth'
        });
    });

    nextButtonGenero.addEventListener('click', () => {
        carouselGenero.scrollBy({
            left: 300, // Ajuste conforme necessário
            behavior: 'smooth'
        });
    });
});

    // Média Player com Div Flutuante //
    let progress = document.getElementById("progress");
    let song = document.getElementById("song");
    let controllIcon = document.getElementById("controllIcon");

    song.onloadedmetadata = function () {
        progress.max = song.duration;
        progress.value = song.currentTime;
    }

    function playPause() {
        if (controllIcon.classList.contains("fa-pause")) {
            song.pause();
            controllIcon.classList.remove("fa-pause");
            controllIcon.classList.add("fa-play");
        }
        else {
            song.play();
            controllIcon.classList.add("fa-pause");
            controllIcon.classList.remove("fa-play");
        }
    }

    if(song.play()) {
        setInterval(() => {
            progress.value = song.currentTime;
        }, 500);
    }

    progress.onchange = function(){
        song.play();
        song.currentTime = progress.value;
        controllIcon.classList.remove("fa-play");
        controllIcon.classList.add("fa-pause");
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



