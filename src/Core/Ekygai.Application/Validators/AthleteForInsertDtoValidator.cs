using Application.Models.DTOs.Athlete;
using Ekygai.Application.Constants;
using FluentValidation;

namespace Ekygai.Application.Validators
{
    public class AthleteForInsertDtoValidator : AbstractValidator<AthleteForInsertDto>
    {
        public AthleteForInsertDtoValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage(AthleteConstants.USER_ID_REQUIRED);

            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage(AthleteConstants.FIRSTNAME_REQUIRED)
                .MaximumLength(50)
                .WithMessage(AthleteConstants.FIRSTNAME_TOO_LONG);

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage(AthleteConstants.LASTNAME_REQUIRED)
                .MaximumLength(50)
                .WithMessage(AthleteConstants.LASTNAME_TOO_LONG);

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage(AthleteConstants.EMAIL_REQUIRED)
                .EmailAddress()
                .WithMessage(AthleteConstants.EMAIL_INVALID);

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .WithMessage(AthleteConstants.PHONE_REQUIRED)
                .Matches(@"^\+?\d{9,15}$")
                .WithMessage(AthleteConstants.PHONE_INVALID);

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage(AthleteConstants.DATE_OF_BIRTH_REQUIRED);
                // .LessThan(DateTime.UtcNow.AddYears(-18))
                // .WithMessage(AthleteConstants.DATE_OF_BIRTH_MINIMUM_AGE);

            RuleFor(x => x.Gender)
                .NotEmpty()
                .WithMessage(AthleteConstants.GENDER_REQUIRED)
                .Must(gender => gender == "Male" || gender == "Female")
                .WithMessage(AthleteConstants.GENDER_INVALID);
        }
    }
}
