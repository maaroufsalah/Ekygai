using Application.Models.DTOs.Athlete;
using Application.Models.DTOs.WorkoutSession;
using AutoMapper;
using Ekygai.Domain.Entities.Athlete;
using Domain.Entities.Subscription;
using Application.DTOs.Subscription;

namespace Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ✅ Athlete Mappings
            CreateMap<Athlete, AthleteForListDto>().ReverseMap();
            CreateMap<Athlete, AthleteForDetailDto>().ReverseMap();
            CreateMap<Athlete, AthleteForInsertDto>().ReverseMap();
            CreateMap<Athlete, AthleteForUpdateDto>().ReverseMap();

            // ✅ Subscription Mappings
            CreateMap<UserSubscription, SubscriptionForListDto>().ReverseMap();
            CreateMap<UserSubscription, SubscriptionForDetailDto>().ReverseMap();
            CreateMap<UserSubscription, SubscriptionForInsertDto>().ReverseMap();
            CreateMap<UserSubscription, SubscriptionForUpdateDto>().ReverseMap();

            // ✅ Plan Mappings
            // CreateMap<Plan, PlanForListDto>().ReverseMap();
            // CreateMap<Plan, PlanForDetailDto>().ReverseMap();
            // CreateMap<Plan, PlanForInsertDto>().ReverseMap();
            // CreateMap<Plan, PlanForUpdateDto>().ReverseMap();

            // ✅ Workout Session Mappings
            // CreateMap<WorkoutSession, WorkoutSessionForListDto>().ReverseMap();
            // CreateMap<WorkoutSession, WorkoutSessionForDetailDto>().ReverseMap();
            CreateMap<WorkoutSession, WorkoutSessionForInsertDto>().ReverseMap();
            // CreateMap<WorkoutSession, WorkoutSessionForUpdateDto>().ReverseMap();
        }
    }
}
