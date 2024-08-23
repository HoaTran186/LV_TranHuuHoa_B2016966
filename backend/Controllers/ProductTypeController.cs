using backend.Data;
using backend.Dtos.Product;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/producttype")]
    [ApiController]
    public class ProductTypeController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public ProductTypeController(ApplicationDBContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var producttypes = await _context.ProductType.ToListAsync();
            var producttypesDto = producttypes.Select(s => s.ToProductDto());

            return Ok(producttypes); 
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync([FromBody] int id)
        {
            var producttype = await _context.ProductType.FindAsync(id);
            if(producttype == null)
            {
                return NotFound();
            }
            return Ok(producttype.ToProductDto());
        }
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateProductTypeRequestDto productTypeDto)
        {
            var productTypeModel = productTypeDto.ToProductTypeFromCreateDto();
            await _context.ProductType.AddAsync(productTypeModel);
            await _context.SaveChangesAsync();
            return Ok(productTypeModel);
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductTypeDto updateDto)
        {
            var productTypeModel =await _context.ProductType.FirstOrDefaultAsync(x =>  x.Id == id);
            if(productTypeModel == null){
                return NotFound();
            }
            productTypeModel.ProductType_Name = updateDto.ProductType_Name;
            await _context.SaveChangesAsync();
            return Ok(productTypeModel.ToProductDto());
        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var productTypeModel = await _context.ProductType.FirstOrDefaultAsync(x => x.Id == id);
            if(productTypeModel == null)
            {
                return NotFound();
            }
            _context.ProductType.Remove(productTypeModel);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}