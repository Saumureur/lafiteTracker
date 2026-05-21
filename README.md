docker compose -f "docker-compose.dev.yml" up -d

To do list:

- Création d'utilisateur soit Admin, Utilisateur (emplyers) écriture et lecture, ou au chai où ils sont uniquement lecteur, avec à quel heure à été créé l'utilisateur et depuis où
- Sauvegarder le nom d'utilisateur (Employé), ainsi que le l'appareil avec le quel il se connecte, l'adresse IP réseau local ou public suivant le lieu, et l'heure de login
- Enregistrement de parcelle ainsi que le sépage qui s'y trouve avec la position GPS avec le % de récolte effectué ce qui permet au employé d'avoir un suivis beaucoup plus précis
- Quand on enregistre une palette un message de confirmation demandera si il y a bien au maximum 25 cagettes sur la pallete, lors du scan du QR Code on enregistreras à quel parcelle la palette apartiens, l'heure d'enregistrement, le poids à partir du tableau défini ainsi que la remorque associé
- Sur l'interface on devra voir en temps réel la mise à jour des informations sans recharger la page
-







qr code template:

{
    "palette": 1
}