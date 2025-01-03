document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const container = document.querySelector('.container');
  const homeContent = document.getElementById('home-content');
  const plantsContent = document.getElementById('plants-content');
  const flowerSelection = document.getElementById('flower-selection');
  const homeButton = document.getElementById('home-button');
  const plantsButton = document.getElementById('plants-button');
  const newPlantButton = document.getElementById('new-plant-button');
  const modal = document.getElementById('modal');
  const selectedFlowerName = document.getElementById('selected-flower-name');
  const connectButton = document.getElementById('connect-button');
  const deviceList = document.getElementById('device-list');
  const closeButton = document.querySelector('.close-button');

  // Variables pour la caméra  
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const snapButton = document.getElementById('snap-button');

  // Fonction pour activer la caméra  
  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("Erreur d'accès à la caméra : ", err);
      });
  };

  // Fonction pour prendre une photo  
  const takePhoto = () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  // Démarrer la caméra lorsque la page est chargée  
  startCamera();

  // Écouter l'événement de clic sur le bouton de capture  
  snapButton.addEventListener('click', takePhoto);

  // Fonction pour ouvrir/fermer la barre latérale  
  const toggleSidebar = () => {
    if (sidebar.style.display === 'none' || !sidebar.style.display) {
      sidebar.style.display = 'block'; // Afficher la barre latérale  
      menuButton.style.display = 'none'; // Masquer le bouton de menu  
    } else {
      sidebar.style.display = 'none'; // Cacher la barre latérale  
      menuButton.style.display = 'block'; // Afficher le bouton de menu  
    }
  };

  // Ouvrir/fermer la barre latérale au clic sur le bouton  
  menuButton.addEventListener('click', toggleSidebar);

  // Changer le contenu affiché  
  homeButton.addEventListener('click', () => {
    homeContent.style.display = 'block';
    plantsContent.style.display = 'none';
    flowerSelection.style.display = 'none'; // Cacher la sélection de fleurs  
    sidebar.style.display = 'none'; // Cacher la barre latérale  
    menuButton.style.display = 'block'; // Afficher le bouton de menu  
  });

  plantsButton.addEventListener('click', () => {
    homeContent.style.display = 'none';
    plantsContent.style.display = 'block';
    flowerSelection.style.display = 'none'; // Cacher la sélection de fleurs  
    sidebar.style.display = 'none'; // Cacher la barre latérale  
    menuButton.style.display = 'block'; // Afficher le bouton de menu  
  });

  newPlantButton.addEventListener('click', () => {
    plantsContent.style.display = 'none';
    flowerSelection.style.display = 'block'; // Afficher la sélection de fleurs  
  });

  // Écouter l'événement de clic sur les boutons des fleurs  
  const flowerButtons = document.querySelectorAll('.flower-button');
  flowerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const flowerName = button.getAttribute('data-name');
      selectedFlowerName.textContent = flowerName; // Mettre à jour le nom de la fleur choisie  
      modal.style.display = 'block'; // Afficher le modal  
      deviceList.innerHTML = ''; // Vider la liste des appareils
      
      // Récupérer les appareils Bluetooth  
      navigator.bluetooth.getDevices()
        .then(devices => {
          devices.forEach(device => {
            const listItem = document.createElement('li');
            listItem.textContent = device.name || 'Unnamed Device';
            deviceList.appendChild(listItem);
          });
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des appareils Bluetooth :', error);
        });
    });
  });

  // Fermer le modal  
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none'; // Cacher le modal  
  });

  // Fonction pour se connecter à un appareil Bluetooth  
  connectButton.addEventListener('click', async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }] // Modifier selon le service souhaité  
      });
      const deviceId = device.id; // Obtenir l'ID de l'appareil connecté  
      // Afficher les informations de la plante et l'ID de l'appareil                    
      plantNameElement.textContent = `Plante choisie : ${selectedFlowerName.textContent}`;
      deviceIdElement.textContent = `ID de l'appareil : ${deviceId}`;
      connectedPlant.style.display = 'block'; // Afficher le rectangle  
    } catch (error) {
      console.error('Erreur lors de la connexion Bluetooth :', error);
    }
  });

  // Fermer la barre si on clique en dehors  
  container.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
      sidebar.style.display = 'none'; // Cacher la barre latérale  
      menuButton.style.display = 'block'; // Afficher le bouton de menu  
    }
  });

  // Fermer la barre latérale en appuyant sur Échap  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebar.style.display = 'none'; // Cacher la barre latérale  
      menuButton.style.display = 'block'; // Afficher le bouton de menu  
    }
  });
});
