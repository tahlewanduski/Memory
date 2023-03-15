"use strict";

// obtenir la largeur et la hauteur de la zone disponible
let lin = 4;
let col = 6;

let premdiv;
let deudiv;

let nbcartesRetournees = 0;
let nbPaireATrouver = 0;

let paires = 0;
let score = 0;
let coups = 0;

let coupReussi = 3;
let coupManque = -1;

function commencerJeu() {
    //PARTIE 1 - Définir une variable qui contiendra le nombre de cartes total :
    //nombre de rangées multiplié par le nombre de colonnes
    let nbcartes = col * lin;

    //PARTIE 1 - Vérifier que les deux variables (colonnes et rangées) soit compris entre 1 et 32
    //ET que le nombre de cartes est pair (indice : modulo)
    //Si ce n'est pas le cas afficher une alert et arrêter l'execution de la fonction (return vide)
    if (lin >= 1 && lin <= 32 && col >= 1 && col <= 32) {
        if (nbcartes % 2 == 0) {
            //PARTIE 1 - Choisir les cartes (création d'un tableau renvoyé par la fonction choisirCartes)
            let tab = choisirCartes(nbcartes);

            //PARTIE 1 - Mélanger les cartes
            tab = melangerCartes(tab);

            //PARTIE 2 - Placer les cartes (HTML)
            placerCartes(tab);

            //PARTIE 4 - Récupérer le nombre de paires à trouver (à partir de la variable qui contient les cartes)
            nbPaireATrouver = nbcartes / 2;

            //PARTIE 5 - Mettre à jour les informations
            mettreAJourInformationsJeu();
        } else {
            alert("erreur : nb cartes non pair")
            //PARTIE 5 - Mettre à jour les informations
            mettreAJourInformationsJeu();
            return;
        }
    } else {
        alert("erreur : lin ou col non valide");
        //PARTIE 5 - Mettre à jour les informations
        mettreAJourInformationsJeu();
        return;
    }

}

function choisirCartes(nbCartes) {
    let tab = [];
    for (let i = 1; i <= nbCartes/2; i++) {
        let i = Math.floor(Math.random() * 32) + 1;
        let imag = "/images/" + i + ".jpg";
        tab.push(imag);
        tab.push(imag);
    }
    return tab;
}

function melangerCartes(tab) {
    for (let i = tab.length - 1; i >= 1; i--) {
        let j1 = Math.floor(Math.random() * i);
        let chg = tab[i];
        tab[i] = tab[j1];
        tab[j1] = chg;
    }
    console.log(tab);
    return tab;
}

function placerCartes(tab) {
    let jeu = document.getElementById("jeu");

    let h = window.getComputedStyle(jeu,null).getPropertyValue("height");
    let w = window.getComputedStyle(jeu,null).getPropertyValue("width");
    let H = parseInt(h);
    let W = parseInt(w);
    console.log(H);
    console.log(W);

    let H_img = (H / lin).toFixed() + "px ";
    let W_img = (W / col).toFixed() + "px ";
    let colm;
    let lini;
    if (H_img <= W_img) {
        colm = H_img.repeat(col);
        lini = H_img.repeat(lin);
        console.log("H-img : " + H_img);
        console.log("H: " + colm);
    } else {
        colm = W_img.repeat(col);
        lini = W_img.repeat(lin);
        console.log("W-img : " + W_img);
        console.log("W: " + colm);
    }

    jeu.style.gridTemplateColumns = colm;
    jeu.style.gridTemplateRows = lini;

    for (let i = 0; i <= tab.length - 1; i++) {
        let img = document.createElement("img");
        img.setAttribute("src", "images/js-logo.jpg");
        let madiv = document.createElement("div");
        madiv.setAttribute("id", "madiv");
        madiv.appendChild(img);
        madiv.dataset.number = tab[i].replace("/images/", "").replace(".jpg", "");
        if (madiv.dataset.number != -1) {
            madiv.addEventListener("click", retournerCarte);
            jeu.appendChild(madiv);
        } else {
            madiv.firstElementChild.style.display = "none";
            jeu.appendChild(madiv);
        }
    }
}

function retournerCarte(event) {
    let div = event.currentTarget;
    let position = parseInt(div.dataset.number);
    let img = event.target;
    nbcartesRetournees++;

    if (nbcartesRetournees < 3) {
        img.src = img.src.replace("js-logo", position)

        if (nbcartesRetournees == 1) {
            premdiv = div;
        }

        if (nbcartesRetournees == 2) {
            if (premdiv != div) {
                deudiv = div;
                setTimeout(controlCartes, 1500);
            } else {
                nbcartesRetournees--;
            }
        }
    }
}

let controlCartes = function () {
    if (premdiv.dataset.number == deudiv.dataset.number && premdiv != deudiv) {
        premdiv.firstElementChild.style.display = "none";
        premdiv.removeEventListener("click", retournerCarte);
        premdiv.dataset.number = -1;
        deudiv.firstElementChild.style.display = "none";
        deudiv.removeEventListener("click", retournerCarte);
        deudiv.dataset.number = -1;
        score = score + coupReussi;
        paires++;
        if (paires == nbPaireATrouver) {
            afficherFinJeu();
        }
    } else {
        premdiv.firstElementChild.src = premdiv.firstElementChild.src.replace(parseInt(premdiv.dataset.number) + ".jpg", "js-logo.jpg");
        deudiv.firstElementChild.src = deudiv.firstElementChild.src.replace(parseInt(deudiv.dataset.number) + ".jpg", "js-logo.jpg");
        score = score + coupManque;
    }
    nbcartesRetournees = 0;
    premdiv = undefined;
    deudiv = undefined;
    coups++;
    mettreAJourInformationsJeu()
}


function mettreAJourInformationsJeu() {
    let localcoups = document.getElementById("coups");
    let localscore = document.getElementById("score");
    let localpaire = document.getElementById("paire");

    let txtcoup = coups;
    localcoups.innerText = txtcoup;

    let txtscore = score;
    localscore.innerText = txtscore;
    
    let txtpaire = paires;
    localpaire.innerText = txtpaire;

    //Récupérer le meilleur score actuel (vérifier s'il existe)
    let bestscore = localStorage.getItem('jeu');

    //Mettre à jour l'information (HTML) du meilleur score
    let bscore = document.getElementById("bestscore");
    bscore.innerText = bestscore;
}

function afficherFinJeu() {
    //Vider le contenu de l'élément jeu et afficher un texte pour dire que la partie est finie
    viderJeu();
    jeu.innerText = "Bravo vous avez fini !";

    memoriserMeilleurScore();
}

function viderJeu() {
    while (jeu.firstChild) {
        jeu.removeChild(jeu.lastChild);
    }
}

function demarrerNouvellePartie(event) {
    //Réinitialiser les variables : score, paires trouvées, ...
    score = 0;
    paires = 0;
    coups = 0;

    //PARTIE 8 - Supprimer le jeu enregistré (s'il y en a un)
    localStorage.removeItem('partie');

    //Vider l'élément jeu
    viderJeu();

    //Modifier les valeurs de colonnes et rangées (à partir des valeurs des inputs)
    lin = document.getElementById("lin").value;
    col = document.getElementById("col").value;

    //Executer la fonction débute le jeu
    commencerJeu();
}

function memoriserMeilleurScore() {
    //Avant toute chose vérifier le nombre de colonnes et de rangées
    //Si le nombre de rangées et de colonnes est correct
    if (col == 6 && lin == 4) {
        //Créer une variable qui contiendra le meilleur score actuel
        let actualscore = score;

        //Récupérer le meilleur score actuel (vérifier s'il existe)
        let bestscore = localStorage.getItem('jeu');

        //Vérifier si le meilleur score n'est pas défini ou si le score actuel est supérieur au meilleur score enregistré
        if (actualscore > bestscore) {

            localStorage.setItem('jeu', actualscore);

            //Mettre à jour l'information (HTML) du meilleur score
            let bscore = document.getElementById("bestscore");
            bscore.innerText = actualscore;

        } else {
            //Mettre à jour l'information (HTML) du meilleur score
            let bscore = document.getElementById("bestscore");
            bscore.innerText = bestscore;
        }

    //Fin Si
    }
}

function enregistrerPartie() {
    //Pour le jeu, récupérer tous les data-numero et les stocker dans un tableau
    let tabjeu = [];
    let children = jeu.children;
    for (let i = 0; i < children.length; i++) {
        let div = children[i];
        tabjeu.push(div.dataset.number);
    }

    //Créer un objet contenant les informations souhaitées
    let partieEnCours = {
        "coups": coups,
        "score": score,
        "paires": paires,
        "pairesRestantes": nbPaireATrouver - paires,
        "nbColonnes": col,
        "nbRangees": lin,
        "jeu": tabjeu
    };

    //Sauvegarde la variable dans le localStore en JSON
    localStorage.setItem('partie', JSON.stringify(partieEnCours));
}

function reprendrePartieEnregistree() {
    //Si aucune partie n'est enregistrée, alors ne rien faire
    let partie = localStorage.getItem('partie');

    if (partie != undefined) {
        //Récupérer la partie enregistrée (en transformer le JSON)
        let partieJson = JSON.parse(partie);

        //Modifier les variables (coups, score, ...) avec les informations de la partie enregistrée
        coups = partieJson.coups;
        score = partieJson.score;
        paires = partieJson.paires;
        col = partieJson.nbColonnes;
        lin = partieJson.nbRangees;
        let cartes = partieJson.jeu;

        let tab = [];
        for (let i = 0; i < cartes.length; i++) {
            let image = "/images/" + cartes[i] + ".jpg";
            tab.push(image);
        }

        //Placer les cartes (HTML)
        placerCartes(tab);
        let nbcartes = col * lin;
        nbPaireATrouver = nbcartes / 2;

        //Mettre à jour les informations (HTML) : scores, ...
        mettreAJourInformationsJeu();

    }
}