async function uploadPhoto() {
    const input = document.getElementById('photoInput');
    const file = input.files[0];
    
    if (!file) {
        alert("Veuillez sélectionner une photo !");
        return;
    }

    const message = document.getElementById("message");
    const loading = document.getElementById("loading");
    const preview = document.getElementById("preview");

    message.textContent = "";
    preview.style.display = "none";
    loading.style.display = "block";

    const formData = new FormData();
    formData.append("photo", file);

    try {
        const response = await fetch("https://photo-upload-supabase.vercel.app/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        
        if (response.ok) {
            message.textContent = "Upload réussi !";
            preview.src = result.url;
            preview.style.display = "block";
        } else {
            message.textContent = "Erreur : " + result.error;
        }
    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        message.textContent = "Erreur lors de l'upload.";
    } finally {
        loading.style.display = "none";
    }
}

async function fetchPhotos() {
    const photosContainer = document.getElementById("photos-container");
    photosContainer.innerHTML = "<p>Chargement des images...</p>";

    try {
        const response = await fetch("https://photo-upload-supabase.vercel.app/photos");
        const photos = await response.json();

        if (!response.ok) {
            photosContainer.innerHTML = "<p>Erreur lors du chargement des photos.</p>";
            return;
        }

        if (photos.length === 0) {
            photosContainer.innerHTML = "<p>Aucune photo disponible.</p>";
            return;
        }

        photosContainer.innerHTML = "";
        photos.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo.url;
            img.alt = "Photo uploadée";
            img.classList.add("gallery-img");
            photosContainer.appendChild(img);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des photos :", error);
        photosContainer.innerHTML = "<p>Erreur lors du chargement des photos.</p>";
    }
}
