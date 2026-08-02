// INSERISCI QUI IL TUO USERNAME GITHUB
const githubUsername = 'Stebs04'; 

async function fetchGitHubProjects() {
    const container = document.getElementById('projects-container');
    
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`);
        const repos = await response.json();

        // Pulisce il testo "Caricamento in corso..."
        container.innerHTML = '';

        // Filtra i repository (escludiamo i fork, mostriamo solo i tuoi progetti originali)
        const myProjects = repos.filter(repo => !repo.fork);

        myProjects.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description : 'Nessuna descrizione disponibile.'}</p>
                <div class="tags">
                    <span>${repo.language ? repo.language : 'Codice'}</span>
                </div>
                <div class="links">
                    <!-- NUOVO: Link alla pagina di dettaglio del progetto -->
                    <a href="project.html?repo=${repo.name}" class="btn-dettagli">Scopri di più &rarr;</a>
                </div>
            `;
            
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p>Errore nel caricamento dei progetti.</p>';
        console.error("Errore API GitHub:", error);
    }
}

// Avvia la funzione al caricamento della pagina
fetchGitHubProjects();