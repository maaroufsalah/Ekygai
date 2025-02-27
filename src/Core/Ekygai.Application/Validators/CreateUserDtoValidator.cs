using Ekygai.Application.Constants;
using Ekygai.Application.Models.DTOs.Identity;
using FluentValidation;

namespace Ekygai.Application.Validators
{
    public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserDtoValidator()
        {
            RuleFor(x => x.PlanId)
                .GreaterThan(0)
                .WithMessage(UserConstants.PLAN_ID_REQUIRED);

            RuleFor(x => x.UserName)
                .NotEmpty()
                .WithMessage(UserConstants.USERNAME_REQUIRED)
                .MinimumLength(3)
                .WithMessage(UserConstants.USERNAME_TOO_SHORT);

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage(UserConstants.PASSWORD_REQUIRED)
                .MinimumLength(6)
                // .WithMessage(UserConstants.PASSWORD_TOO_SHORT)
                // .Matches(@"[A-Z]").WithMessage(UserConstants.PASSWORD_UPPERCASE)
                // .Matches(@"[a-z]").WithMessage(UserConstants.PASSWORD_LOWERCASE)
                // .Matches(@"\d").WithMessage(UserConstants.PASSWORD_NUMBER)
                // .Matches(@"[\W]").WithMessage(UserConstants.PASSWORD_SPECIAL_CHAR)
                ;

            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage(UserConstants.FIRSTNAME_REQUIRED)
                .MaximumLength(50)
                .WithMessage(UserConstants.FIRSTNAME_TOO_LONG);

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage(UserConstants.LASTNAME_REQUIRED)
                .MaximumLength(50)
                .WithMessage(UserConstants.LASTNAME_TOO_LONG);

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage(UserConstants.EMAIL_REQUIRED)
                .EmailAddress()
                .WithMessage(UserConstants.EMAIL_INVALID);

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .WithMessage(UserConstants.PHONE_REQUIRED)
                .Matches(@"^\+?\d{9,15}$")
                .WithMessage(UserConstants.PHONE_INVALID);

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage(UserConstants.DATE_OF_BIRTH_REQUIRED);
                // .LessThan(DateTime.UtcNow.AddYears(-18))
                // .WithMessage(UserConstants.DATE_OF_BIRTH_MINIMUM_AGE);

            RuleFor(x => x.Gender)
                .NotEmpty()
                .WithMessage(UserConstants.GENDER_REQUIRED)
                .Must(gender => gender == "Male" || gender == "Female")
                .WithMessage(UserConstants.GENDER_INVALID);
        }
    }
}