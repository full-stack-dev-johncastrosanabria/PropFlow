using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropFlow.Application.Common.DTOs.Properties;
using PropFlow.Application.Common.Interfaces;
using System.Security.Claims;

namespace PropFlow.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;

    public PropertiesController(IPropertyService propertyService)
    {
        _propertyService = propertyService;
    }

    private Guid GetLandlordId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _propertyService.GetAllAsync(GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _propertyService.GetByIdAsync(id, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PropertyDto>> Create([FromBody] CreatePropertyDto dto, CancellationToken cancellationToken)
    {
        var result = await _propertyService.CreateAsync(dto, GetLandlordId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PropertyDto>> Update(Guid id, [FromBody] UpdatePropertyDto dto, CancellationToken cancellationToken)
    {
        var result = await _propertyService.UpdateAsync(id, dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _propertyService.DeleteAsync(id, GetLandlordId(), cancellationToken);
        return NoContent();
    }
}
