# IA GÉNÉRALISTE

## Objectif

Cette IA est une machine à état avec 3 états:
- Hunter: État dans lequel on poursuit l'ennemi dans l'objectif de le tuer.
- Prey: État dans lequel on fuit l'ennemi pour se soigner.
- Execute: État dans lequel on pense pouvoir abattre l'ennemi donc on fait tout pour l'achever.

## Inspiration

- [IA de Franck Boucher](https://github.com/franck-boucher/IA-leek-wars/tree/master)

## Intérêts

- Il s'agit là d'une IA multi fichiers (j'ai galéré à trouver la syntaxe...)
- La structure de données de la variable "ARMES" est intéressante (il y a possibilité de lire et écrire des JSON en leekscript même si là c'est pas le cas).
- Les armes et puces enregistrées dans ARMES sont des instances d'objets (n'ayant pas de méthode certes mais checkez [ce post](https://leekwars.com/forum/category-7/topic-7624) : la syntaxe est dépréciée mais ma syntaxe combinée au post et PAF vous avez des objets tout beaux tout propres).

## Améliorations futures

- Checker ce qui ne marche pas avec la fonction lineOfSight
- Debugger tous les crashs possibles (Je sais que l'impossibilité de bouger et la mort de l'ennemi sont deux choses qui font crash mais il n'y a pas que ça)
- Ajouter un algorithme du sac à dos pour optimiser les dégâts infligés
- Trouver la formule de calcul des dégâts pour encore plus les optimiser
