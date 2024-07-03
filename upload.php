<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "music";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar se todos os campos do formulário estão presentes e não estão vazios
    if (!isset($_POST['beat_name']) || empty($_POST['beat_name']) ||
        !isset($_POST['description']) || empty($_POST['description']) ||
        !isset($_POST['bpm']) || empty($_POST['bpm']) ||
        !isset($_POST['category']) || empty($_POST['category']) ||
        !isset($_POST['price']) || empty($_POST['price']) ||
        !isset($_FILES['cover_image']) || empty($_FILES['cover_image']['name']) ||
        !isset($_FILES['beat_file']) || empty($_FILES['beat_file']['name'])) {
        die("Por favor, preencha todos os campos do formulário.");
    }

    $beat_name = $_POST['beat_name'];
    $description = $_POST['description'];
    $bpm = $_POST['bpm'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $image = $_FILES['cover_image']['name']; // Nome do arquivo de imagem
    $audio = $_FILES['beat_file']['name']; // Nome do arquivo de áudio

    // Diretórios onde os arquivos serão armazenados
    $target_dir_image = "uploads/images/";
    $target_dir_audio = "uploads/audio/";

    // Caminhos completos dos arquivos
    $target_file_image = $target_dir_image . basename($image);
    $target_file_audio = $target_dir_audio . basename($audio);

    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file_image, PATHINFO_EXTENSION));
    $audioFileType = strtolower(pathinfo($target_file_audio, PATHINFO_EXTENSION));

    // Verifica se o arquivo de imagem é uma imagem real
    $check_image = getimagesize($_FILES["cover_image"]["tmp_name"]);
    if($check_image === false) {
        echo "Arquivo não é uma imagem.";
        $uploadOk = 0;
    }

    // Verifica se o arquivo de áudio é válido
    if ($_FILES['beat_file']['error'] !== 0) {
        echo "Erro ao enviar arquivo de áudio.";
        $uploadOk = 0;
    }

    // Verifica se os arquivos já existem
    if (file_exists($target_file_image)) {
        echo "Desculpe, o arquivo de imagem já existe.";
        $uploadOk = 0;
    }
    if (file_exists($target_file_audio)) {
        echo "Desculpe, o arquivo de áudio já existe.";
        $uploadOk = 0;
    }

    // Verifica o tamanho dos arquivos
    if ($_FILES["cover_image"]["size"] > 1000000000) {
        echo "Desculpe, seu arquivo de imagem é muito grande.";
        $uploadOk = 0;
    }
    if ($_FILES["beat_file"]["size"] > 1000000000) {
        echo "Desculpe, seu arquivo de áudio é muito grande.";
        $uploadOk = 0;
    }

    // Permitir certos formatos de arquivo
    $allowed_image_types = array("jpg", "jpeg", "png", "gif");
    $allowed_audio_types = array("mp3", "wav", "ogg");

    if (!in_array($imageFileType, $allowed_image_types)) {
        echo "Desculpe, apenas arquivos JPG, JPEG, PNG e GIF são permitidos para a imagem.";
        $uploadOk = 0;
    }
    if (!in_array($audioFileType, $allowed_audio_types)) {
        echo "Desculpe, apenas arquivos MP3, WAV e OGG são permitidos para o áudio.";
        $uploadOk = 0;
    }

    // Verifica se $uploadOk está configurado como 0 por algum erro
    if ($uploadOk == 0) {
        echo "Desculpe, seus arquivos não foram enviados.";
    } else {
        if (move_uploaded_file($_FILES["cover_image"]["tmp_name"], $target_file_image) && move_uploaded_file($_FILES["beat_file"]["tmp_name"], $target_file_audio)) {
            // Query SQL para inserir os dados na tabela uploads (usando instruções preparadas para segurança)
            $sql = "INSERT INTO uploads (beat_name, description, bpm, category, price, cover_image_path, audio_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssissss", $beat_name, $description, $bpm, $category, $price, $target_file_image, $target_file_audio);
            
            if ($stmt->execute()) {
                echo "O beat foi carregado com sucesso.";
            } else {
                echo "Erro ao inserir dados: " . $stmt->error;
            }
        } else {
            echo "Erro ao mover arquivos.<br>";
            echo "Erro cover_image: " . $_FILES["cover_image"]["error"] . "<br>";
            echo "Erro beat_file: " . $_FILES["beat_file"]["error"] . "<br>";
            print_r(error_get_last());
        }
    }
    $conn->close();
}
?>
