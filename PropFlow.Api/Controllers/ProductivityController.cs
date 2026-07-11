using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropFlow.Application.Common.DTOs.Productivity;
using PropFlow.Application.Common.Interfaces;
using System.Security.Claims;

namespace PropFlow.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductivityController : ControllerBase
{
    private readonly IProductivityService _service;

    public ProductivityController(IProductivityService service)
    {
        _service = service;
    }

    private Guid GetLandlordId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("summary")]
    public async Task<ActionResult<ProductivitySummaryDto>> GetSummary(CancellationToken cancellationToken)
    {
        var result = await _service.GetSummaryAsync(GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("day")]
    public async Task<ActionResult<DailyActivityDto>> GetDay([FromQuery] DateTime? date, CancellationToken cancellationToken)
    {
        var result = await _service.GetDayAsync(GetLandlordId(), date ?? DateTime.UtcNow.Date, cancellationToken);
        return Ok(result);
    }

    [HttpPut("day")]
    public async Task<ActionResult<DailyActivityDto>> UpsertDay([FromBody] UpsertDailyActivityDto dto, CancellationToken cancellationToken)
    {
        var result = await _service.UpsertAsync(dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("goals")]
    public async Task<ActionResult<ProductivityGoalsDto>> GetGoals(CancellationToken cancellationToken)
    {
        var result = await _service.GetGoalsAsync(GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpPut("goals")]
    public async Task<ActionResult<ProductivityGoalsDto>> UpdateGoals([FromBody] ProductivityGoalsDto dto, CancellationToken cancellationToken)
    {
        var result = await _service.UpdateGoalsAsync(dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }
}
