using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropFlow.Application.Common.DTOs.RentalUnits;
using PropFlow.Application.Common.Interfaces;
using System.Security.Claims;

namespace PropFlow.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RentalUnitsController : ControllerBase
{
    private readonly IRentalUnitService _rentalUnitService;

    public RentalUnitsController(IRentalUnitService rentalUnitService)
    {
        _rentalUnitService = rentalUnitService;
    }

    private Guid GetLandlordId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RentalUnitDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _rentalUnitService.GetAllAsync(GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("property/{propertyId}")]
    public async Task<ActionResult<IEnumerable<RentalUnitDto>>> GetByPropertyId(Guid propertyId, CancellationToken cancellationToken)
    {
        var result = await _rentalUnitService.GetByPropertyIdAsync(propertyId, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RentalUnitDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _rentalUnitService.GetByIdAsync(id, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<RentalUnitDto>> Create([FromBody] CreateRentalUnitDto dto, CancellationToken cancellationToken)
    {
        var result = await _rentalUnitService.CreateAsync(dto, GetLandlordId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<RentalUnitDto>> Update(Guid id, [FromBody] UpdateRentalUnitDto dto, CancellationToken cancellationToken)
    {
        var result = await _rentalUnitService.UpdateAsync(id, dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _rentalUnitService.DeleteAsync(id, GetLandlordId(), cancellationToken);
        return NoContent();
    }
}
