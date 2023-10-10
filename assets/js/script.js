// ----Déclarations préalables des éléments utiles----

// div contenant les lettres du clavier virtuel
const letterContainer = document.getElementById("letter-container");
// éléments des options/menu utilisateur
const optionsContainer = document.getElementById("options-container");
// 
const userInputSection = document.getElementById("user-input-section");
//  div contenant les éléments pour jouer une nouvelle partie
const newGameContainer = document.getElementById("new-game-container");
// bouton rejouer
const newGameButton = document.getElementById("new-game-button");
// déclaration du canvas où le pendu apparaît
const canvas = document.getElementById("canvas");
// déclaration du texte (win/loose)
const resultText = document.getElementById("result-text");

//Menu utilisateur

let options = {
  anime: [
    "Shoto",
    "Tanjiro",
    "Sasuke",
    "GojoSatoru",
    "Nana",
    "Saitama",
    "Luffy",
    "Pochita",
    "Phantomhive",
    "Shinichi",
  ],

  Pokémon: [
    "Lippoutou",
    "Rondoudou",
    "Ronflex",
    "Absol",
    "Tyranocif",
    "Metamorph",
  ],

  surprise: [
    "Capybara",
    "Mastication",
    "Flasque",
    "Bedonnant",
    "Glitch",
  ],

  genshin : [
    "Venti",
    "Zhongli",
    "Raiden",
    "Nahida",
    "Furina",
  ]
};

//déclaration du score win et score count(défaite) , déclaration de la variable du mot "choisi" avec une valeur indéterminée pour le moment
let winCount = 0;
let count = 0;

let chosenWord = "";

// Affichage du menu utilisateur, affichage d'un texte dans le menu utilisateur
const displayOptions = () => {
  optionsContainer.innerHTML += `<h3>Sélectionne une catégorie</h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};

// désactiver les boutons du menu et les lettres en mode jeu, déclaration de la variable blocker qui pourra être "appelée"
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");

  // désactiver le menu utilisateur
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });

  // désactiver toutes les lettres lorsque le jeu est fini 
  letterButtons.forEach((button) => {
    button.disabled.true;
  });
  newGameContainer.classList.remove("hide");
};

// Générateur de mots

// déclaration du générateur de mots, rattaché aux boutons du menu utilisateur
const generateWord = (optionValue) => {
  let optionsButtons = document.querySelectorAll(".options");

  //If optionValue matches the button innerText then highlight the button
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });

  // désactivation de la div letterContainer au début du jeu 
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  // 
  let optionArray = options[optionValue];
  
  //Choix d'un mot au hasard aprés validation d'une catégorie dans le menu utilisateur
  chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  chosenWord = chosenWord.toUpperCase();

  // remplacement des lettres du mot par des span contenant un tiret au début du jeu, on déclare displayItem comme valeur de remplacement du mot, /./signifie n'importe quel caractère", "g"  signifie que la recherche et le remplacement doivent être effectués sur toutes les occurrences du caractère n'importe où dans la chaîne
  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');

  //Display each element as span
  userInputSection.innerHTML = displayItem;
};

//Démarrage (affichage quand la nouvelle page charge, quand le bouton newgame a été activé)
const initializer = () => {
  winCount = 0;
  count = 0;

  //efface tout le contenu et cache les lettres et le bouton newgame
  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";

  //Création du clavier virtuel,attribution des boutons aux lettres du clavier d'aprés le code ASCII (définit la représentation des caractères par les ordinateurs, les caractères ont des valeurs binaires, ainsi chaque caractère a un code binaire qui lui est propre, reconnu par l'ordinateur)

//   on assigne les "bouton" du clavier virtuel à des lettres
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");

    //assimilation du codage ASCII[lettres A à Z]
    button.innerText = String.fromCharCode(i);

    //évènements au click (choix de la lettre)
    button.addEventListener("click", () => {
      let charArray = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");

      // Si la lettre choisie correspond à une lettre du mot, la remplacer par sa valeur, ou dessine le pendu sur le canva
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          //si la valeur de la lettre correspond à une lettre du mot
          if (char === button.innerText) {
            //remplace le tiret par la lettre
            dashes[index].innerText = char;
            //augmente le "score" quand lettre découverte
            winCount += 1;
            //si le compte (positif) est égal au nombre de lettre du mot, alors affiche message victoire
            if (winCount == charArray.length) {
              resultText.innerHTML = `<h2 class='win-msg'>Super, bravo, youpi. <br> Tu veux une médaille ?</h2><p>Le mot était <span>${chosenWord}</span></p>`;
              //bloque tous les boutons
              blocker();
            }
          }
        });
      } else {
        //si compte défaite augmente, lettre fausse
        count += 1;
        //dessine le pendu
        drawMan(count);
        //si le compte défaite est égal à 6, alors affiche message défaite, et bloque les boutons(idem phase précédente)
        if (count == 6) {
          resultText.innerHTML = `<h2 class='lose-msg'  !important' >Mdr, t'es pas le pingouin <br> qui glisse le plus loin.</h2><p>Le mot était 
          <span>${chosenWord}. </span> ouin ouin </p>`;
          blocker();
        }
      }
      //pour désactiver les boutons
      button.disabled = true;
    });
    letterContainer.append(button);
  }

  displayOptions();

  //réinitialisation du tableau (pendu)
  let { initialDrawing } = canvasCreator();
   initialDrawing();
};

//Tableau du pendu
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;

  //pour dessiner les lignes composant le pendu
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };

  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };

  const body = () => {
    drawLine(70, 40, 70, 80);
  };

  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };

  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };

  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };

  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  }; 

  //cadre initial, dessin de la base de la base de la potence
  const initialDrawing = () => {
    //remet le tableau à neuf
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    drawLine(10, 130, 130, 130);
    
    drawLine(10, 10, 10, 131);
    
    drawLine(10, 10, 70, 10);
    
    drawLine(70, 10, 70, 20);
  }; 

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
}; 

//dessine le pendu, au fur et à mesure du "score positif" des défaites
const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

//Nouvelle partie
newGameButton.addEventListener("click", initializer);
window.onload = initializer;