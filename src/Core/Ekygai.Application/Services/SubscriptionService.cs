using Application.DTOs.Subscription;
using Application.Wrappers;
using AutoMapper;
using Domain.Entities.Subscription;
using Domain.Enums;
using Ekygai.Application.Constants;
using Ekygai.Application.Interfaces.IRepositories;
using Ekygai.Application.Interfaces.IServices;

namespace Ekygai.Application.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly IMapper _mapper;
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IPlanRepository _planRepository;

        public SubscriptionService(
            IMapper mapper,
            ISubscriptionRepository subscriptionRepository,
            IPlanRepository planRepository)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _subscriptionRepository = subscriptionRepository ?? throw new ArgumentNullException(nameof(subscriptionRepository));
            _planRepository = planRepository ?? throw new ArgumentNullException(nameof(planRepository));
        }

        public async Task<Response<SubscriptionForDetailDto>> GetSubscriptionByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
                return new Response<SubscriptionForDetailDto>(SubscriptionConstants.SUBSCRIPTION_NOT_FOUND);

            var subscription = await _subscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
                return new Response<SubscriptionForDetailDto>(SubscriptionConstants.SUBSCRIPTION_NOT_FOUND);

            var mappedResponse = _mapper.Map<SubscriptionForDetailDto>(subscription);
            return new Response<SubscriptionForDetailDto>(mappedResponse);
        }

        public async Task<Response<List<SubscriptionForListDto>>> GetSubscriptionsAsync()
        {
            var subscriptions = await _subscriptionRepository.GetAllAsync();
            var mappedResponse = _mapper.Map<List<SubscriptionForListDto>>(subscriptions);
            return new Response<List<SubscriptionForListDto>>(mappedResponse);
        }

        public async Task<Response<SubscriptionForDetailDto>> CreateSubscriptionAsync(SubscriptionForInsertDto subscriptionForInsertDto)
        {
            if (subscriptionForInsertDto == null)
                return new Response<SubscriptionForDetailDto>(SubscriptionConstants.DATA_EMPTY);

            // Check the Plan
            var planExist = await _planRepository.PlanExistsAsync(subscriptionForInsertDto.PlanId);
            if (!planExist)
                return new Response<SubscriptionForDetailDto>(SubscriptionConstants.PLAN_NOT_FOUND);

            // Calculate EndDate based on Plan Duration
            DateTime endDate = subscriptionForInsertDto.SubscriptionType == SubscriptionType.Monthly
                ? subscriptionForInsertDto.StartDate.AddMonths(1)  // Monthly Plan
                : subscriptionForInsertDto.StartDate.AddYears(1);  // Yearly Plan

            var subscription = _mapper.Map<UserSubscription>(subscriptionForInsertDto);
            subscription.EndDate = endDate;
            subscription.IsActive = true;  // Default to active
            subscription.CreatedBy = "System";
            subscription.CreatedAt = DateTime.UtcNow;

            await _subscriptionRepository.AddAsync(subscription);
            var result = await _subscriptionRepository.SaveChangesAsync();

            if (result > 0)
            {
                var mappedResponse = _mapper.Map<SubscriptionForDetailDto>(subscription);
                return new Response<SubscriptionForDetailDto>(mappedResponse, SubscriptionConstants.CREATE_OK);
            }

            return new Response<SubscriptionForDetailDto>(SubscriptionConstants.CREATE_KO);
        }


        public async Task<Response<SubscriptionForDetailDto>> UpdateSubscriptionAsync(SubscriptionForUpdateDto subscriptionForUpdateDto)
        {
            if (subscriptionForUpdateDto == null)
                throw new ArgumentNullException(nameof(subscriptionForUpdateDto));

            var subscription = await _subscriptionRepository.GetByIdAsync(subscriptionForUpdateDto.Id);
            if (subscription == null)
                return new Response<SubscriptionForDetailDto>(SubscriptionConstants.SUBSCRIPTION_NOT_FOUND);

            _mapper.Map(subscriptionForUpdateDto, subscription);
            subscription.UpdatedAt = DateTime.UtcNow;

            _subscriptionRepository.UpdateAsync(subscription);
            var result = await _subscriptionRepository.SaveChangesAsync();

            if (result > 0)
            {
                var mappedResponse = _mapper.Map<SubscriptionForDetailDto>(subscription);
                return new Response<SubscriptionForDetailDto>(mappedResponse, SubscriptionConstants.UPDATE_OK);
            }

            return new Response<SubscriptionForDetailDto>(SubscriptionConstants.UPDATE_KO);
        }

        public async Task<Response<bool>> CancelSubscriptionAsync(Guid id)
        {
            if (id == Guid.Empty)
                return new Response<bool>(false, SubscriptionConstants.SUBSCRIPTION_NOT_FOUND);

            var subscription = await _subscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
                return new Response<bool>(false, SubscriptionConstants.SUBSCRIPTION_NOT_FOUND);

            subscription.IsActive = false; // Deactivate subscription
            subscription.UpdatedAt = DateTime.UtcNow;

            _subscriptionRepository.UpdateAsync(subscription);
            var result = await _subscriptionRepository.SaveChangesAsync();

            return result > 0
                ? new Response<bool>(true, SubscriptionConstants.CANCEL_OK)
                : new Response<bool>(false, SubscriptionConstants.CANCEL_KO);
        }

        public async Task<Response<bool>> DeleteSubscriptionByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
                return new Response<bool>(false, SubscriptionConstants.SUBSCRIPTION_NOT_FOUND);

            var subscription = await _subscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
                return new Response<bool>(false, SubscriptionConstants.SUBSCRIPTION_NOT_FOUND);

            subscription.IsActive = false; // Mark as inactive
            subscription.DeletedAt = DateTime.UtcNow;

            _subscriptionRepository.UpdateAsync(subscription);
            var result = await _subscriptionRepository.SaveChangesAsync();

            return result > 0
                ? new Response<bool>(true, SubscriptionConstants.DELETE_OK)
                : new Response<bool>(false, SubscriptionConstants.DELETE_KO);
        }

    }
}