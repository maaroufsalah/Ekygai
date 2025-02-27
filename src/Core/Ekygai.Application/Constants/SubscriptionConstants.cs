namespace Ekygai.Application.Constants
{
    public static class SubscriptionConstants
    {
        public const string SERVICE_UNAVAILABLE = "Ce service est temporairement indisponible ! Réessayer ultérieurement.";
        public const string SUBSCRIPTION_NOT_FOUND = "Abonnement introuvable.";
        public const string PLAN_NOT_FOUND = "Plan d'abonnement introuvable.";
        public const string DATA_EMPTY = "Les données fournies sont vides ou invalides.";

        public const string CREATE_OK = "Abonnement créé avec succès.";
        public const string CREATE_KO = "Échec de la création de l'abonnement.";

        public const string UPDATE_OK = "Abonnement mis à jour avec succès.";
        public const string UPDATE_KO = "Échec de la mise à jour de l'abonnement.";

        public const string CANCEL_OK = "Abonnement annulé avec succès.";
        public const string CANCEL_KO = "Échec de l'annulation de l'abonnement.";

        public const string DELETE_OK = "L'abonnement a été supprimé avec succès.";
        public const string DELETE_KO = "Échec de la suppression de l'abonnement.";

        // **Validation Messages**
        public const string USER_ID_REQUIRED = "L'ID de l'utilisateur est requis.";
        public const string PLAN_ID_REQUIRED = "L'ID du plan est requis.";
        public const string START_DATE_INVALID = "La date de début ne peut pas être dans le passé.";
        public const string SUBSCRIPTION_TYPE_INVALID = "Le type d'abonnement est invalide.";
        public const string PAYMENT_METHOD_REQUIRED = "Le mode de paiement est requis.";
    }
}