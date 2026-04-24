using AutoMapper;
using PropFlow.Application.Common.DTOs.Auth;
using PropFlow.Application.Common.DTOs.Contracts;
using PropFlow.Application.Common.DTOs.MaintenanceRequests;
using PropFlow.Application.Common.DTOs.Payments;
using PropFlow.Application.Common.DTOs.Properties;
using PropFlow.Application.Common.DTOs.RentalUnits;
using PropFlow.Application.Common.DTOs.Tenants;
using PropFlow.Domain.Entities;

namespace PropFlow.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Landlord
        CreateMap<Landlord, LandlordDto>();
        
        // Property
        CreateMap<Property, PropertyDto>();
        CreateMap<CreatePropertyDto, Property>();
        CreateMap<UpdatePropertyDto, Property>();
        
        // RentalUnit
        CreateMap<RentalUnit, RentalUnitDto>();
        CreateMap<CreateRentalUnitDto, RentalUnit>();
        CreateMap<UpdateRentalUnitDto, RentalUnit>();
        
        // Tenant
        CreateMap<Tenant, TenantDto>();
        CreateMap<CreateTenantDto, Tenant>();
        CreateMap<UpdateTenantDto, Tenant>();
        
        // Contract
        CreateMap<Contract, ContractDto>()
            .ForMember(dest => dest.TenantName, opt => opt.MapFrom(src => src.Tenant.FullName))
            .ForMember(dest => dest.UnitName, opt => opt.MapFrom(src => src.RentalUnit.Name));
        CreateMap<CreateContractDto, Contract>();
        CreateMap<UpdateContractDto, Contract>();
        
        // Payment
        CreateMap<Payment, PaymentDto>();
        CreateMap<CreatePaymentDto, Payment>();
        CreateMap<UpdatePaymentDto, Payment>();
        
        // MaintenanceRequest
        CreateMap<MaintenanceRequest, MaintenanceRequestDto>()
            .ForMember(dest => dest.PropertyName, opt => opt.MapFrom(src => src.Property.Name))
            .ForMember(dest => dest.UnitName, opt => opt.MapFrom(src => src.RentalUnit != null ? src.RentalUnit.Name : null));
        CreateMap<CreateMaintenanceRequestDto, MaintenanceRequest>();
        CreateMap<UpdateMaintenanceRequestDto, MaintenanceRequest>();
    }
}
