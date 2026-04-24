using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropFlow.Application.Common.DTOs.MaintenanceRequests;
using PropFlow.Application.Common.Interfaces;
using System.Security.Claims;

namespace PropFlow.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MaintenanceRequestsController : ControllerBase
{
    private readonly IMaintenanceRequestService _maintenanceRequestService;

    public MaintenanceRequestsController(IMaintenanceRequestService maintenanceRequestService)
    {
        _maintenanceRequestService = maintenanceRequestService;
    }

    private Guid GetLandlordId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaintenanceRequestDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _maintenanceRequestService.GetAllAsync(GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaintenanceRequestDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _maintenanceRequestService.GetByIdAsync(id, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<MaintenanceRequestDto>> Create([FromBody] CreateMaintenanceRequestDto dto, CancellationToken cancellationToken)
    {
        var result = await _maintenanceRequestService.CreateAsync(dto, GetLandlordId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MaintenanceRequestDto>> Update(Guid id, [FromBody] UpdateMaintenanceRequestDto dto, CancellationToken cancellationToken)
    {
        var result = await _maintenanceRequestService.UpdateAsync(id, dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _maintenanceRequestService.DeleteAsync(id, GetLandlordId(), cancellationToken);
        return NoContent();
    }
}
