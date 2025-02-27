namespace Ekygai.Application.Constants
{
    public static class UserConstants
    {
        public const string PLAN_ID_REQUIRED = "L'ID du plan est requis.";

        public const string USERNAME_REQUIRED = "Le nom d'utilisateur est requis.";
        public const string USERNAME_TOO_SHORT = "Le nom d'utilisateur doit contenir au moins 3 caractères.";

        public const string PASSWORD_REQUIRED = "Le mot de passe est requis.";
        public const string PASSWORD_TOO_SHORT = "Le mot de passe doit contenir au moins 8 caractères.";
        public const string PASSWORD_UPPERCASE = "Le mot de passe doit contenir au moins une lettre majuscule.";
        public const string PASSWORD_LOWERCASE = "Le mot de passe doit contenir au moins une lettre minuscule.";
        public const string PASSWORD_NUMBER = "Le mot de passe doit contenir au moins un chiffre.";
        public const string PASSWORD_SPECIAL_CHAR = "Le mot de passe doit contenir au moins un caractère spécial.";

        public const string FIRSTNAME_REQUIRED = "Le prénom est requis.";
        public const string FIRSTNAME_TOO_LONG = "Le prénom ne doit pas dépasser 50 caractères.";

        public const string LASTNAME_REQUIRED = "Le nom de famille est requis.";
        public const string LASTNAME_TOO_LONG = "Le nom de famille ne doit pas dépasser 50 caractères.";

        public const string EMAIL_REQUIRED = "L'adresse e-mail est requise.";
        public const string EMAIL_INVALID = "L'adresse e-mail n'est pas valide.";

        public const string PHONE_REQUIRED = "Le numéro de téléphone est requis.";
        public const string PHONE_INVALID = "Le numéro de téléphone n'est pas valide.";

        public const string DATE_OF_BIRTH_REQUIRED = "La date de naissance est requise.";
        public const string DATE_OF_BIRTH_MINIMUM_AGE = "L'utilisateur doit avoir au moins 18 ans.";

        public const string GENDER_REQUIRED = "Le genre est requis.";
        public const string GENDER_INVALID = "Le genre doit être 'Male', 'Female'.";

        public const string USER_TYPE_INVALID = "Le type d'utilisateur sélectionné est invalide.";
    }
}