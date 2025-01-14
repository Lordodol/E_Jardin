document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const container = document.querySelector('.container');
  const homeContent = document.getElementById('home-content');
  const plantsContent = document.getElementById('plants-content');
  const flowerSelection = document.getElementById('flower-selection');
  const aboutSection = document.getElementById('about-section'); // Sélectionner la section "À propos"
  const homeButton = document.getElementById('home-button');
  const plantsButton = document.getElementById('plants-button');
  const newPlantButton = document.getElementById('new-plant-button');
  const aboutButton = document.getElementById('about-button'); // Sélectionner le bouton "À propos"
  const plantListContainer = document.getElementById('plant-list-container');

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const snapButton = document.getElementById('snap-button');
  const clearButton = document.getElementById('clear-button');
  const selectPlantButton = document.getElementById('select-plant-button');
  const plantSelect = document.getElementById('plant-select');
  const plantInfoSelect = document.getElementById('plant-info-select'); // Nouveau select pour info plante  
  const plantPhotoGallery = document.getElementById('plant-photo-gallery');
  const selectedPlantNameGallery = document.getElementById('selected-plant-name-gallery');
  const photosContainer = document.getElementById('photos-container');
  const closeGalleryButton = document.getElementById('close-gallery');
  const plantCareTips = document.getElementById('plant-care-tips'); // Élément pour afficher les conseils

  const plantPhotos = {}; // Stockage des photos pour chaque plante  
  const addedPlants = []; // Stockage des plantes ajoutées par l'utilisateur

  // Résumé des conseils pour faire pousser une rose  
  const roseCareTips = `
  Faire pousser une rose en intérieur dans un pot peut être une expérience enrichissante et agréable. Voici les étapes à suivre :<br>
  <br>
  <strong>1. Choisir la bonne variété de rose :</strong> Roses naines, optez pour des variétés adaptées à la culture en intérieur.<br>
  <strong>2. Sélectionner un pot :</strong> Choisissez un pot d'au moins 15-20 cm de diamètre avec drainage.<br>
  <strong>3. Préparer le sol :</strong> Utilisez un terreau de qualité, bien drainant.<br>
  <strong>4. Planter la rose :</strong> Remplissez le pot avec du terreau, placez la rose au centre et arrosez.<br>
  <strong>5. Conditions de lumière :</strong> Placez le pot dans un endroit lumineux, besoin de 6 à 8 heures de lumière par jour.<br>
  <strong>6. Arrosage :</strong> Arrosez modérément, laissez sécher légèrement entre les arrosages.<br>
  <strong>7. Humidité :</strong> Vaporisez avec de l'eau quelques fois par semaine.<br>
  <strong>8. Fertilisation :</strong> Utilisez un engrais équilibré tous les 4 à 6 semaines.<br>
  <strong>9. Taille et entretien :</strong> Taillez les fleurs fanées et surveillez les ravageurs.<br>
  <strong>10. Température :</strong> Préférez une température ambiante de 18-24 °C.
  `;

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
      canvas.style.display = 'block'; // Afficher le canevas après la capture

      // Récupérer les données de l'image  
      const photoDataUrl = canvas.toDataURL();

      // Masquer le bouton "Prendre une photo" et afficher les autres boutons  
      snapButton.style.display = 'none'; // Masquer le bouton "Prendre une photo"
      clearButton.style.display = 'block'; // Afficher le bouton "Effacer"
      selectPlantButton.style.display = 'block'; // Afficher le bouton "Sélectionner une plante"
      plantSelect.style.display = 'block'; // Afficher le dropdown

      // Réinitialiser le dropdown  
      plantSelect.innerHTML = '<option value="">Choisissez une plante</option>'; // Réinitialiser les options  
      addedPlants.forEach(plant => {
          const option = document.createElement('option');
          option.value = plant; // La valeur de l'option est le nom de la plante  
          option.textContent = plant; // Affichage du nom de la plante  
          plantSelect.appendChild(option); // Ajouter l'option au select  
      });

      // Ajouter l'écouteur pour le bouton de sélection de plante  
      selectPlantButton.onclick = () => {
          const plantName = plantSelect.value; // Récupérer la plante sélectionnée  
          if (plantName) {
              addPhotoToGallery(plantName, photoDataUrl); // Ajouter la photo à la galerie de la plante  
              alert(`Photo ajoutée à ${plantName}`);
              selectPlantButton.style.display = 'none'; // Masquer le bouton après sélection  
              plantSelect.style.display = 'none'; // Masquer le dropdown après sélection  
          } else {
              alert("Veuillez choisir une plante.");
          }
      };
  };

  const addPhotoToGallery = (plantName, photoDataUrl) => {
      if (!plantPhotos[plantName]) {
          plantPhotos[plantName] = []; // Créer un tableau pour la plante si inexistant  
      }
      plantPhotos[plantName].push(photoDataUrl); // Ajouter la photo  
  };

  // Fonction pour ajouter une nouvelle plante  
  const addNewPlant = (plantName) => {
      if (!addedPlants.includes(plantName)) {
          addedPlants.push(plantName); // Ajouter la plante à la liste de plantes ajoutées  
          const plantBox = document.createElement('div');
          plantBox.className = 'connected-plant'; // Appliquer la classe pour le style  
          plantBox.innerHTML = `<p>${plantName}</p>`; // Mettre à jour le contenu avec le nom de la plante  
          plantListContainer.appendChild(plantBox); // Ajouter le rectangle au conteneur  

          // Ajouter une option pour la nouvelle plante dans le select de conseils  
          const option = document.createElement('option');
          option.value = plantName;
          option.textContent = plantName;
          plantInfoSelect.appendChild(option); // Ajouter l'option au menu déroulant  
      }
  };

  // Écouteur d'événement pour afficher la galerie de photos d'une plante  
  document.addEventListener('click', (e) => {
      if (e.target.classList.contains('connected-plant')) {
          const plantName = e.target.textContent; // Récupérer le nom de la plante  
          selectedPlantNameGallery.textContent = plantName; // Mettre à jour le nom de la plante dans la galerie  
          photosContainer.innerHTML = ''; // Vider le conteneur des photos  
          if (plantPhotos[plantName]) {
              plantPhotos[plantName].forEach((photo) => {
                  const img = document.createElement('img');
                  img.src = photo;
                  img.classList.add('gallery-image'); // Ajouter une classe pour le style  
                  photosContainer.appendChild(img);
              });
          }
          plantPhotoGallery.style.display = 'block'; // Afficher la galerie  
      }
  });

  // Affichage des conseils de soins en fonction de la plante sélectionnée  
  plantInfoSelect.addEventListener('change', (e) => {
      const selectedPlant = e.target.value;
      if (selectedPlant) {
          if (selectedPlant === 'Rose') {
              plantCareTips.innerHTML = roseCareTips; // Afficher les conseils pour la rose  
          } else {
              plantCareTips.textContent = 'Sélectionnez une plante pour voir les conseils.';
          }
      } else {
          plantCareTips.textContent = 'Sélectionnez une plante pour voir les conseils.';
      }
  });

  // Fermeture de la galerie  
  closeGalleryButton.addEventListener('click', () => {
      plantPhotoGallery.style.display = 'none'; // Cacher la galerie  
  });

  // Effacer la photo  
  const clearPhoto = () => {
      canvas.style.display = 'none'; // Masquer le canevas  
      snapButton.style.display = 'block'; // Afficher le bouton "Prendre une photo"
      clearButton.style.display = 'none'; // Masquer le bouton "Effacer"
      selectPlantButton.style.display = 'none'; // Masquer le bouton "Sélectionner une plante"
      plantSelect.style.display = 'none'; // Masquer le dropdown  
  };

  // Écouter l'événement de clic sur le bouton "Effacer"
  clearButton.addEventListener('click', clearPhoto);

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
      flowerSelection.style.display = 'none';
      aboutSection.style.display = 'none'; // Cacher la section "À propos"
      sidebar.style.display = 'none'; // Cacher la barre latérale  
      menuButton.style.display = 'block'; // Afficher le bouton de menu  
  });

  plantsButton.addEventListener('click', () => {
      homeContent.style.display = 'none';
      plantsContent.style.display = 'block';
      flowerSelection.style.display = 'none';
      aboutSection.style.display = 'none'; // Cacher la section "À propos"
      sidebar.style.display = 'none'; // Cacher la barre latérale  
      menuButton.style.display = 'block'; // Afficher le bouton de menu  
  });

  // Écouter l'événement de clic sur le bouton "À propos"
  aboutButton.addEventListener('click', () => {
      homeContent.style.display = 'none'; // Cacher la section d'accueil  
      plantsContent.style.display = 'none'; // Cacher la section des plantes  
      flowerSelection.style.display = 'none'; // Cacher la sélection de fleurs  
      aboutSection.style.display = 'block'; // Afficher la section "À propos"
      sidebar.style.display = 'none'; // Cacher la barre latérale  
      menuButton.style.display = 'block'; // Afficher le bouton de menu  
  });

  // Réinitialiser le bouton "Nouvelle Plante" pour afficher la sélection de fleurs  
  newPlantButton.addEventListener('click', () => {
      plantsContent.style.display = 'none';
      flowerSelection.style.display = 'block'; // Afficher la sélection de fleurs  
  });

  // Écouter l'événement de clic sur les boutons des fleurs  
  const flowerButtons = document.querySelectorAll('.flower-button');
  flowerButtons.forEach(button => {
      button.addEventListener('click', () => {
          const flowerName = button.getAttribute('data-name');
          console.log(`Plante choisie : ${flowerName}`); // Débogage : afficher le nom de la plante choisie
          
          // Créer un rectangle pour afficher la plante choisie  
          addNewPlant(flowerName); // Utiliser la fonction pour ajouter la plante

          // Afficher la section "Mes Plantes" si elle est cachée  
          document.getElementById('connected-plant-list').style.display = 'block'; // Afficher le conteneur des plantes connectées  
          plantsContent.style.display = 'block'; // Afficher la section "Mes Plantes"
          flowerSelection.style.display = 'none'; // Cacher la sélection de fleurs  
      });
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

  // Démarrer la caméra lorsque la page est chargée  
  startCamera();
});
