# Noël Magique — thème Shopify (étape 1 sur 3 : la base)

Ce dépôt contient **le thème complet de ta boutique Shopify « Noël Magique »**, prêt à installer, plus le fichier d'import des 3 produits et le texte de toutes les pages.

| Dossier / fichier | Contenu |
|---|---|
| `livrables/noel-magique-theme.zip` | Le thème, à importer dans Shopify |
| `contenu/produits-shopify.csv` | Les 3 produits, à importer dans Shopify |
| `contenu/pages/*.html` | Le texte des pages (livraison, contact, légal…) |
| `layout/`, `sections/`, `snippets/`, `templates/`, `assets/`, `config/`, `locales/` | Le code du thème |

---

## Installation pas à pas

### 1. Réglages de base (Paramètres)
1. **Paramètres > Général** : nom de la boutique = `Noël Magique`, devise euro.
2. **Paramètres > Taxes et droits** : coche **« Toutes les taxes sont incluses dans les prix »** (prix TTC).
3. **Paramètres > Expédition et livraison** : règle tes tarifs. Le thème affiche « Livraison offerte » : si la livraison n'est **pas** gratuite, change ce texte (voir étape 6).
4. **Paramètres > Notifications** : vérifie que l'e-mail de la boutique est le bon (il reçoit les formulaires de contact et de rétractation).

### 2. Créer les métachamps produits (avant l'import)
**Paramètres > Données personnalisées > Produits > Ajouter une définition** :

| Nom | Code (namespace.key) | Type | Rôle |
|---|---|---|---|
| Fournisseur | `custom.fournisseur` | URL | Lien fournisseur pour passer les commandes. **Jamais affiché aux clients.** |
| Lien Whop | `custom.lien_whop` | URL | Lien de paiement Whop (1 article) |
| Lien Whop 2 articles | `custom.lien_whop_2` | URL | Facultatif : offre 2 articles (-5 %) |
| Lien Whop 3 articles | `custom.lien_whop_3` | URL | Facultatif : offre 3 articles (-10 %) |
| Fabricant – nom | `custom.fabricant_nom` | Texte sur une ligne | GPSR |
| Fabricant – adresse | `custom.fabricant_adresse` | Texte multiligne | GPSR (adresse postale ou électronique) |
| Fabricant – responsable UE | `custom.fabricant_responsable_ue` | Texte multiligne | GPSR |
| Délais de livraison | `custom.delais_livraison` | Texte sur une ligne | Facultatif |
| Caractéristiques | `custom.caracteristiques` | Texte multiligne | Facultatif : une caractéristique vérifiée par ligne |

Facultatifs pour personnaliser les textes de la fiche : `custom.surtitre`, `custom.accroche` (texte sur une ligne), `custom.avantages`, `custom.point_vigilance` (texte multiligne, un avantage par ligne).

### 3. Importer les produits
**Produits > Importer** > choisis `contenu/produits-shopify.csv`. Shopify télécharge lui-même les photos. Vérifie ensuite chaque produit : prix, photo, texte alternatif.
> Les liens de photos fournis expirent fin 2026 : importe le fichier dès maintenant.

### 4. Créer la catégorie « Idées cadeaux »
**Produits > Collections > Créer une collection** : titre `Idées cadeaux`, type **automatisée**, condition « Balise du produit est égale à `idee-cadeau` ». L'adresse doit être `/collections/idees-cadeaux`.

### 5. Installer le thème
**Boutique en ligne > Thèmes > Ajouter un thème > Importer un fichier zip** > `livrables/noel-magique-theme.zip`, puis **Publier**.
(Autre option : **Ajouter un thème > Se connecter depuis GitHub**, et choisis ce dépôt et la branche.)

### 6. Personnaliser (Boutique en ligne > Thèmes > Personnaliser > Paramètres du thème)
- **Boutique** : ton e-mail de contact, l'argument livraison (vide si la livraison n'est pas offerte), les moyens de paiement acceptés.
- **Paiement** : mode **Whop** (par défaut) ou **Shopify**.
- **Accueil > Hero** : choisis le produit mis en avant et, si tu en as une, une photo du produit **en situation** (sans texte dessus). La vignette « Voir le produit en action » apparaît seulement si tu ajoutes une vidéo.
- Vérifie que les textes du bandeau, des pastilles et de la barre de confiance sont **tous vrais** pour ta boutique.

### 7. Créer les pages (Boutique en ligne > Pages > Ajouter une page)
Pour chaque page : titre, colle le contenu du fichier HTML (bouton `<>` de l'éditeur), choisis le **modèle** indiqué et vérifie l'**adresse** (section « Référencement »).

| Titre | Adresse (handle) | Fichier | Modèle |
|---|---|---|---|
| Livraison et retours | `livraison-et-retours` | `livraison-et-retours.html` | `livraison-retours` |
| Contact | `contact` | `contact.html` | `contact` |
| Se rétracter du contrat | `retractation` | `retractation.html` | `retractation` |
| Mentions légales | `mentions-legales` | `mentions-legales.html` | par défaut |
| Conditions générales de vente | `conditions-generales-de-vente` | `conditions-generales-de-vente.html` | par défaut |
| Politique de retour | `politique-de-retour` | `politique-de-retour.html` | `livraison-retours` |
| Politique de confidentialité | `politique-de-confidentialite` | `politique-de-confidentialite.html` | par défaut |

Remplace **chaque** `[À COMPLÉTER]`. Recopie aussi ces textes dans **Paramètres > Politiques** (Shopify les affiche au paiement).

### 8. Paiement avec Whop
1. Crée un compte sur Whop.
2. Termine la vérification d'identité et renseigne tes informations de versement.
3. Crée **un produit Whop par article**, au même prix TTC que sur le site (44,90 €, 29,90 €, 24,90 €).
4. Copie chaque lien de paiement.
5. Colle-le dans le métachamp **Lien Whop** du produit correspondant (fiche produit dans l'admin, en bas).
6. Facultatif, offres de quantité : crée aussi des produits Whop « 2 articles » et « 3 articles » au prix remisé affiché sur la fiche (par exemple pour le microscope : 85,31 € et 121,23 €), et colle leurs liens dans **Lien Whop 2 / 3 articles**. Sans ces liens, les offres ne s'affichent pas en mode Whop.
7. Fais un **achat test** pour vérifier tout le parcours.

Tant qu'un produit n'a pas de lien Whop, le thème utilise le panier Shopify pour ce produit.

### 9. Offres de quantité en mode Shopify (obligatoire si tu les gardes)
La fiche produit affiche « 2 articles : -5 % » et « 3 articles : -10 % ». Pour que le prix payé corresponde, crée **deux remises automatiques** dans **Remises** :
- « Réduction sur des produits », 5 %, quantité minimale d'articles : 2 ;
- « Réduction sur des produits », 10 %, quantité minimale d'articles : 3.

Sinon, décoche « Afficher les offres de quantité » dans **Personnaliser > Fiche produit**.

### 10. Droit de rétractation (directive (UE) 2023/2673)
Le bouton **« Se rétracter du contrat »** est dans le pied de page de toutes les pages, sur la page Livraison et retours et sur la page Politique de retour. Il ouvre un formulaire en ligne. **Quand tu reçois une demande, envoie au client un accusé de réception par e-mail sans tarder** (date et contenu de sa demande), et garde une copie.

### 11. Cookies
Le thème a son propre bandeau (Accepter / Refuser à égalité), relié à l'outil de confidentialité de Shopify. Si tu préfères la bannière intégrée de Shopify (**Paramètres > Confidentialité des clients**), décoche « Afficher le bandeau cookies du thème ».

---

## À COMPLÉTER AVANT D'OUVRIR LA BOUTIQUE
- [ ] Tes informations légales : nom ou raison sociale, adresse, SIRET, e-mail de contact, médiateur de la consommation (pages légales + réglage « E-mail de contact »).
- [ ] Les informations du fabricant de chaque produit (GPSR) : nom, adresse postale ou électronique, personne responsable dans l'UE → métachamps « Fabricant ». Demande-les à ton fournisseur.
- [ ] Les délais de livraison réels de ton fournisseur vers la France (page Livraison et retours, CGV).
- [ ] Les caractéristiques exactes de chaque produit (taille, matière, autonomie…), vérifiées auprès du fournisseur → métachamp « Caractéristiques ».
- [ ] Les photos supplémentaires et vidéos de chaque produit (uniquement des visuels sans texte ni logo).
- [ ] Tes moyens de paiement : active-les (Whop et/ou Shopify Payments) et fais une commande test.
- [ ] Vérifie que « Livraison offerte » est vrai, sinon modifie-le partout (bandeau, hero, barre de confiance, bandeau défilant, réglages).

## Ce que fait le thème
- **Accueil** : bandeau d'annonce rouge, en-tête (logo, menu, recherche, panier avec pastille), hero sombre en dégradé avec photo produit, boules de Noël et bonhomme de neige au survol des boutons, bandeau défilant, barre de confiance, grille produits (2e photo au survol, cœur, étiquette « Idée cadeau », bouton « Voir le produit »), « Pourquoi nous choisir » avec liens d'aide, « Comment ça marche », FAQ en accordéon, pied de page complet.
- **Fiche produit** : 2 colonnes sur ordinateur (galerie avec miniatures, flèches et zoom au mouvement de la souris), avantages avec coches vertes, offres de quantité avec vraies remises calculées, sélecteur de quantité, « Ajouter au panier » (ou « Acheter » via Whop), moyens de paiement, pastilles de réassurance, sections repliables (Description avec point de vigilance, Caractéristiques, Livraison et retours, Informations sur le fabricant), FAQ produit, « Vous aimerez aussi », bouton d'achat collé en bas sur mobile.
- **Panier latéral** qui glisse depuis la droite, avec total réel et bouton « Commander ».
- **Ambiance** : guirlande lumineuse, neige visible (une cinquantaine de flocons, coupée si l'appareil demande moins d'animations), rubans canne en sucre entre les sections.
- **Pages** : catalogue, recherche, 404, contact, rétractation, pages légales. Balises SEO (titre, description) sur chaque page.
- **Honnêteté** : aucun faux avis, compteur, compte à rebours, prix barré ou stock inventé. Aucun logo de marque. Le lien fournisseur n'est jamais affiché.
