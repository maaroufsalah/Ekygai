namespace Ekygai.Application.Constants
{
    public static class AthleteConstants
    {
        public const string ATHLETE_NOT_FOUND = "L'athléte n'existe pas";
        public const string CREATE_OK = "L'athléte est enregistré(e) avec succès";
        public const string CREATE_KO = "Enregistrement de l'athléte non effectué, merci de réessayer ultérieurement";
        public const string UPDATE_OK = "L'athléte est modifié(e) avec succès";
        public const string UPDATE_KO = "Modification de l'athléte non effectuée, merci de réessayer ultérieurement";
        public const string DELETE_OK = "L'athléte est supprimé(e) avec succès";
        public const string DELETE_KO = "Suppression de l'athléte non effectuée, merci de réessayer ultérieurement";
        public const string EMAIL_EXIST = "L'adresse e-mail est déjà utilisée";
        public const string DATA_EMPTY = "Merci de saisir les données de l'athléte";

        // Validation Messages
        public const string USER_ID_REQUIRED = "L'identifiant de l'utilisateur est requis.";
        public const string FIRSTNAME_REQUIRED = "Le prénom est requis.";
        public const string FIRSTNAME_TOO_LONG = "Le prénom ne peut pas dépasser 50 caractères.";
        public const string LASTNAME_REQUIRED = "Le nom de famille est requis.";
        public const string LASTNAME_TOO_LONG = "Le nom de famille ne peut pas dépasser 50 caractères.";
        public const string EMAIL_REQUIRED = "L'adresse e-mail est requise.";
        public const string EMAIL_INVALID = "L'adresse e-mail n'est pas valide.";
        public const string PHONE_REQUIRED = "Le numéro de téléphone est requis.";
        public const string PHONE_INVALID = "Le format du numéro de téléphone est invalide.";
        public const string DATE_OF_BIRTH_REQUIRED = "La date de naissance est requise.";
        public const string DATE_OF_BIRTH_MINIMUM_AGE = "L'athlète doit avoir au moins 18 ans.";
        public const string GENDER_REQUIRED = "Le genre est requis.";
        public const string GENDER_INVALID = "Le genre doit être 'Male' ou 'Female'.";
    }

    public static class WorkoutSessionConstants
    {
        public const string WORKOUT_NOT_FOUND = "Entrainement n'existe pas";
        public const string CREATE_OK = "L'entrainement est enregistré(e) avec succès";
        public const string CREATE_KO = "Enregistrement de l'entrainement non effectué, merci de réessayer ultérieurement";
        public const string UPDATE_OK = "L'entrainement est modifié(e) avec succès";
        public const string UPDATE_KO = "Modification de l'entrainement non effectuée, merci de réessayer ultérieurement";
        public const string DELETE_OK = "L'entrainement est supprimé(e) avec succès";
        public const string DELETE_KO = "Suppression de l'entrainement non effectuée, merci de réessayer ultérieurement";
    }
}