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
    $beat_name = $_POST['beat_name'];
    $description = $_POST['description'];
    $bpm = $_POST['bpm'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $image = $_FILES['cover_image']['name'];
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($image);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Verifica se o arquivo é uma imagem real
    $check = getimagesize($_FILES["cover_image"]["tmp_name"]);
    if($check !== false) {
        $uploadOk = 1;
    } else {
        echo "Arquivo não é uma imagem.";
        $uploadOk = 0;
    }

    // Verifica se o arquivo já existe
    if (file_exists($target_file)) {
        echo "Desculpe, o arquivo já existe.";
        $uploadOk = 0;
    }

    // Verifica o tamanho do arquivo
    if ($_FILES["cover_image"]["size"] > 500000) {
        echo "Desculpe, seu arquivo é muito grande.";
        $uploadOk = 0;
    }

    // Permitir certos formatos de arquivo
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
        echo "Desculpe, apenas arquivos JPG, JPEG, PNG e GIF são permitidos.";
        $uploadOk = 0;
    }

    // Verifica se $uploadOk está configurado como 0 por algum erro
    if ($uploadOk == 0) {
        echo "Desculpe, seu arquivo não foi enviado.";
    // Se tudo estiver ok, tenta fazer o upload do arquivo
    } else {
        if (move_uploaded_file($_FILES["cover_image"]["tmp_name"], $target_file)) {
            $sql = "INSERT INTO beats (beat_name, description, bpm, category, price, image)
            VALUES ('$beat_name', '$description', '$bpm', '$category', '$price', '$image')";

            if ($conn->query($sql) === TRUE) {
                echo "O beat foi carregado com sucesso.";
            } else {
                echo "Erro: " . $sql . "<br>" . $conn->error;
            }
        } else {
            echo "Desculpe, houve um erro ao enviar seu arquivo.";
        }
    }
    $conn->close();
}
?>
