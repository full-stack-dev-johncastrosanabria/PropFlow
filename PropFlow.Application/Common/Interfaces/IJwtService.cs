using PropFlow.Domain.Entities;

namespace PropFlow.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(Landlord landlord);
}
