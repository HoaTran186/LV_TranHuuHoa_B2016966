using backend.Data;
using backend.Dtos.Product;
using backend.Helpers;
using backend.Interfaces;
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
        private readonly IProductTypeRepository _productTypeRepo;
        public ProductTypeController(ApplicationDBContext context, IProductTypeRepository productRepo)
        {
            _context = context;
            _productTypeRepo = productRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            if(!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }
            var producttypes = await _productTypeRepo.GetAllAsync(query);
            var producttypesDto = producttypes.Select(s => s.ToProductDto());

            return Ok(producttypes); 
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }
            var producttype = await _productTypeRepo.GetByIdAsync(id);
            if(producttype == null)
            {
                return NotFound();
            }
            return Ok(producttype.ToProductDto());
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductTypeRequestDto productTypeDto)
        {
            if(!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }
            var productTypeModel = productTypeDto.ToProductTypeFromCreateDto();
            await _productTypeRepo.CreateAsync(productTypeModel);
            return Ok(productTypeModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductTypeRequestDto updateDto)
        {
            if(!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }
            var productTypeModel =await _productTypeRepo.UpdateAsync(id,updateDto);
            if(productTypeModel == null){
                return NotFound();
            }
            return Ok(productTypeModel.ToProductDto());
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }
            var productTypeModel = await _productTypeRepo.DeleteAsync(id);
            if(productTypeModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted Product Type");
        }
    }
}