// INSERISCI QUI IL TUO USERNAME GITHUB
const githubUsername = 'Stebs04'; 

// Legge il nome del repository dall'URL (es. ?repo=mio-progetto)
const urlParams = new URLSearchParams(window.location.search);
const repoName = urlParams.get('repo');

let images = [];
let currentImageIndex = 0;

async function loadProjectDetails() {
    if (!repoName) {
        document.getElementById('repo-title').textContent = "Progetto non trovato";
        return;
    }

    try {
        // 1. Recupera i dettagli del repository
        const repoRes = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}`);
        const repo = await repoRes.json();

        document.getElementById('repo-title').textContent = repo.name;
        document.getElementById('repo-desc').textContent = repo.description || "Nessuna descrizione.";
        
        const linksContainer = document.getElementById('repo-links');
        linksContainer.innerHTML = `<a href="${repo.html_url}" target="_blank" class="btn">Vedi Codice su GitHub</a>`;
        if (repo.homepage) {
            linksContainer.innerHTML += `<a href="${repo.homepage}" target="_blank" class="btn" style="background: #1e293b;">Sito Live</a>`;
        }

        // 2. Recupera le immagini dalla cartella "portfolio-images" nel repository
        const imagesRes = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/portfolio-images`);
        
        if (imagesRes.ok) {
            const files = await imagesRes.json();
            // Filtra solo i file immagine
            images = files
                .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
                .map(file => file.download_url); // Prende l'URL diretto dell'immagine
            
            if (images.length > 0) {
                setupCarousel();
            } else {
                document.getElementById('no-images-msg').style.display = 'block';
            }
        } else {
            // La cartella non esiste o non ci sono file
            document.getElementById('no-images-msg').style.display = 'block';
        }
    } catch (error) {
        console.error("Errore:", error);
    }
}

function setupCarousel() {
    document.getElementById('carousel-container').classList.remove('carousel-hidden');
    document.getElementById('carousel-container').classList.add('carousel-visible');
    updateCarousel();

    document.getElementById('prev-btn').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateCarousel();
    });
}

function updateCarousel() {
    const imgElement = document.getElementById('carousel-img');
    imgElement.src = images[currentImageIndex];
    document.getElementById('image-counter').textContent = `Immagine ${currentImageIndex + 1} di ${images.length}`;
}

// Avvia tutto
loadProjectDetails();