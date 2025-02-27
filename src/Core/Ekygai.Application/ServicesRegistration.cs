using System.Reflection;
using Ekygai.Application.Interfaces.IServices;
using Ekygai.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Ekygai.Application
{
    public static class ServicesRegistration
    {
        public static void AddApplicationLayer(this IServiceCollection services)
        {
            // AutoMapper configuration
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Service registrations
            services.AddScoped<IAthleteService, AthleteService>();
            services.AddScoped<ISubscriptionService, SubscriptionService>();

            // FluentValidation: Registers all validators automatically
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}