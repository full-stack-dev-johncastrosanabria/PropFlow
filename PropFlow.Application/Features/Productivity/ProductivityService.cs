using AutoMapper;
using PropFlow.Application.Common.DTOs.Productivity;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Productivity;

public class ProductivityService : IProductivityService
{
    private readonly IRepository<DailyActivity> _repo;
    private readonly IRepository<ProductivityGoals> _goalsRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    // Keller Williams gold standard: 3-hour lead generation time block every day.
    private const decimal LeadGenBlockTarget = 3m;

    public ProductivityService(
        IRepository<DailyActivity> repo,
        IRepository<ProductivityGoals> goalsRepo,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _repo = repo;
        _goalsRepo = goalsRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductivityGoalsDto> GetGoalsAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var existing = (await _goalsRepo.FindAsync(g => g.LandlordId == landlordId, cancellationToken)).FirstOrDefault();
        return existing != null ? _mapper.Map<ProductivityGoalsDto>(existing) : new ProductivityGoalsDto();
    }

    public async Task<ProductivityGoalsDto> UpdateGoalsAsync(ProductivityGoalsDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var existing = (await _goalsRepo.FindAsync(g => g.LandlordId == landlordId, cancellationToken)).FirstOrDefault();
        if (existing == null)
        {
            existing = new ProductivityGoals { Id = Guid.NewGuid(), LandlordId = landlordId, CreatedAtUtc = DateTime.UtcNow };
            ApplyGoals(dto, existing);
            await _goalsRepo.AddAsync(existing, cancellationToken);
        }
        else
        {
            ApplyGoals(dto, existing);
            await _goalsRepo.UpdateAsync(existing, cancellationToken);
        }
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<ProductivityGoalsDto>(existing);
    }

    private static void ApplyGoals(ProductivityGoalsDto dto, ProductivityGoals entity)
    {
        entity.LeadGenHours = Math.Max(0, dto.LeadGenHours);
        entity.Contacts = Math.Max(0, dto.Contacts);
        entity.Conversations = Math.Max(0, dto.Conversations);
        entity.AppointmentsSet = Math.Max(0, dto.AppointmentsSet);
        entity.LeadsAdded = Math.Max(0, dto.LeadsAdded);
        entity.AppointmentsMet = Math.Max(0, dto.AppointmentsMet);
    }

    public async Task<DailyActivityDto> GetDayAsync(Guid landlordId, DateTime date, CancellationToken cancellationToken = default)
    {
        var day = date.Date;
        var existing = (await _repo.FindAsync(a => a.LandlordId == landlordId && a.Date == day, cancellationToken)).FirstOrDefault();
        return existing != null
            ? _mapper.Map<DailyActivityDto>(existing)
            : new DailyActivityDto { Date = day };
    }

    public async Task<DailyActivityDto> UpsertAsync(UpsertDailyActivityDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var day = dto.Date.Date;
        var existing = (await _repo.FindAsync(a => a.LandlordId == landlordId && a.Date == day, cancellationToken)).FirstOrDefault();

        if (existing == null)
        {
            existing = new DailyActivity
            {
                Id = Guid.NewGuid(),
                LandlordId = landlordId,
                Date = day,
                CreatedAtUtc = DateTime.UtcNow
            };
            Apply(dto, existing);
            await _repo.AddAsync(existing, cancellationToken);
        }
        else
        {
            Apply(dto, existing);
            await _repo.UpdateAsync(existing, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<DailyActivityDto>(existing);
    }

    private static void Apply(UpsertDailyActivityDto dto, DailyActivity entity)
    {
        entity.Contacts = Math.Max(0, dto.Contacts);
        entity.Conversations = Math.Max(0, dto.Conversations);
        entity.LeadsAdded = Math.Max(0, dto.LeadsAdded);
        entity.AppointmentsSet = Math.Max(0, dto.AppointmentsSet);
        entity.AppointmentsMet = Math.Max(0, dto.AppointmentsMet);
        entity.AgreementsSigned = Math.Max(0, dto.AgreementsSigned);
        entity.OffersWritten = Math.Max(0, dto.OffersWritten);
        entity.LeadGenHours = Math.Max(0, dto.LeadGenHours);
        entity.Notes = dto.Notes;
    }

    public async Task<ProductivitySummaryDto> GetSummaryAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var all = (await _repo.FindAsync(a => a.LandlordId == landlordId, cancellationToken)).ToList();
        var byDate = all.ToDictionary(a => a.Date.Date, a => a);

        var goalsEntity = (await _goalsRepo.FindAsync(g => g.LandlordId == landlordId, cancellationToken)).FirstOrDefault();
        var goals = goalsEntity != null ? _mapper.Map<ProductivityGoalsDto>(goalsEntity) : new ProductivityGoalsDto();

        // week = Monday..Sunday containing today
        var diffToMonday = ((int)today.DayOfWeek + 6) % 7;
        var weekStart = today.AddDays(-diffToMonday);
        var monthStart = new DateTime(today.Year, today.Month, 1);
        var last30Start = today.AddDays(-29);

        var todayActivity = byDate.TryGetValue(today, out var ta)
            ? _mapper.Map<DailyActivityDto>(ta)
            : new DailyActivityDto { Date = today };

        var weekTotals = Totals(all.Where(a => a.Date >= weekStart && a.Date <= today));
        var monthTotals = Totals(all.Where(a => a.Date >= monthStart && a.Date <= today));
        var last30Totals = Totals(all.Where(a => a.Date >= last30Start && a.Date <= today));

        // Last 7 days series (oldest -> newest)
        var last7 = new List<DayPointDto>();
        for (var i = 6; i >= 0; i--)
        {
            var d = today.AddDays(-i);
            byDate.TryGetValue(d, out var rec);
            last7.Add(new DayPointDto
            {
                Date = d,
                Label = d.ToString("ddd", System.Globalization.CultureInfo.InvariantCulture),
                Contacts = rec?.Contacts ?? 0,
                Conversations = rec?.Conversations ?? 0,
                AppointmentsMet = rec?.AppointmentsMet ?? 0,
                LeadGenHours = rec?.LeadGenHours ?? 0,
                BlockDone = (rec?.LeadGenHours ?? 0) >= LeadGenBlockTarget
            });
        }

        return new ProductivitySummaryDto
        {
            Today = today,
            TodayActivity = todayActivity,
            WeekTotals = weekTotals,
            MonthTotals = monthTotals,
            Last30Totals = last30Totals,
            LeadGenStreak = CurrentStreak(byDate, today),
            BestStreak = BestStreak(byDate),
            Last7Days = last7,
            Goals = goals
        };
    }

    private static ActivityTotalsDto Totals(IEnumerable<DailyActivity> src)
    {
        var list = src.ToList();
        return new ActivityTotalsDto
        {
            Contacts = list.Sum(a => a.Contacts),
            Conversations = list.Sum(a => a.Conversations),
            LeadsAdded = list.Sum(a => a.LeadsAdded),
            AppointmentsSet = list.Sum(a => a.AppointmentsSet),
            AppointmentsMet = list.Sum(a => a.AppointmentsMet),
            AgreementsSigned = list.Sum(a => a.AgreementsSigned),
            OffersWritten = list.Sum(a => a.OffersWritten),
            LeadGenHours = list.Sum(a => a.LeadGenHours),
            DaysLogged = list.Count
        };
    }

    private static bool Done(Dictionary<DateTime, DailyActivity> byDate, DateTime d) =>
        byDate.TryGetValue(d.Date, out var r) && r.LeadGenHours >= LeadGenBlockTarget;

    // Consecutive days with the block done, ending today (or yesterday if today not yet done).
    private static int CurrentStreak(Dictionary<DateTime, DailyActivity> byDate, DateTime today)
    {
        var cursor = Done(byDate, today) ? today : today.AddDays(-1);
        var streak = 0;
        while (Done(byDate, cursor))
        {
            streak++;
            cursor = cursor.AddDays(-1);
        }
        return streak;
    }

    private static int BestStreak(Dictionary<DateTime, DailyActivity> byDate)
    {
        var days = byDate.Values.Where(a => a.LeadGenHours >= LeadGenBlockTarget)
            .Select(a => a.Date.Date).OrderBy(d => d).ToList();
        if (days.Count == 0) return 0;

        int best = 1, run = 1;
        for (var i = 1; i < days.Count; i++)
        {
            if (days[i] == days[i - 1].AddDays(1)) run++;
            else run = 1;
            best = Math.Max(best, run);
        }
        return best;
    }
}
