using PropFlow.Domain.Interfaces;

namespace PropFlow.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly PropFlowDbContext _context;

    public UnitOfWork(PropFlowDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
