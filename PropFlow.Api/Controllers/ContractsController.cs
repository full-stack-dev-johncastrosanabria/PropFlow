using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropFlow.Application.Common.DTOs.Contracts;
using PropFlow.Application.Common.Interfaces;
using System.Security.Claims;

namespace PropFlow.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly IContractService _contractService;

    public ContractsController(IContractService contractService)
    {
        _contractService = contractService;
    }

    private Guid GetLandlordId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _contractService.GetAllAsync(GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _contractService.GetByIdAsync(id, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ContractDto>> Create([FromBody] CreateContractDto dto, CancellationToken cancellationToken)
    {
        var result = await _contractService.CreateAsync(dto, GetLandlordId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContractDto>> Update(Guid id, [FromBody] UpdateContractDto dto, CancellationToken cancellationToken)
    {
        var result = await _contractService.UpdateAsync(id, dto, GetLandlordId(), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _contractService.DeleteAsync(id, GetLandlordId(), cancellationToken);
        return NoContent();
    }
}
