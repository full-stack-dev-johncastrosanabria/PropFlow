using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropFlow.Application.Common.DTOs.Leads;
using PropFlow.Application.Common.Interfaces;
using System.Security.Claims;

namespace PropFlow.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _leadService;

    public LeadsController(ILeadService leadService)
    {
        _leadService = leadService;
    }

    private Guid GetLandlordId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeadDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _leadService.GetAllAsync(GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LeadDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _leadService.GetByIdAsync(id, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<LeadDto>> Create([FromBody] CreateLeadDto dto, CancellationToken cancellationToken)
    {
        var result = await _leadService.CreateAsync(dto, GetLandlordId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<LeadDto>> Update(Guid id, [FromBody] UpdateLeadDto dto, CancellationToken cancellationToken)
    {
        var result = await _leadService.UpdateAsync(id, dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{id}/stage")]
    public async Task<ActionResult<LeadDto>> UpdateStage(Guid id, [FromBody] UpdateLeadStageDto dto, CancellationToken cancellationToken)
    {
        var result = await _leadService.UpdateStageAsync(id, dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _leadService.DeleteAsync(id, GetLandlordId(), cancellationToken);
        return NoContent();
    }
}
