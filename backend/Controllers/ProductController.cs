using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
     [Route("api/product")]
     [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
       public ProductController(ApplicationDBContext context)
       {
            _context = context;
       }
       [HttpGet]
       public async Task<IActionResult> GetAllAsync()
       {
        var products =await _context.Products.ToListAsync();

        return Ok(products);
       }
       [HttpGet("{id:int}")]
       public async Task<IActionResult> GetByIdAsync([FromRoute] int id)
       {
            var product = await _context.Products.FindAsync(id);
            if(product == null)
            {
                return NotFound();
            }

            return Ok(product);
       }
    }
}