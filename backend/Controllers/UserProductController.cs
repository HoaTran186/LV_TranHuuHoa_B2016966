using backend.Extensions;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/userproduct")]
    [ApiController]
    public class UserProductController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IProductRepository _productRepo;
        private readonly IUserProductRepository _userProductRepo;
        public UserProductController(UserManager<AppUser> userManager, IProductRepository productRepo, IUserProductRepository userProductRepo)
        {
            _userManager = userManager;
            _productRepo = productRepo;
            _userProductRepo = userProductRepo;
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserProduct()
        {
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var userProduct = await _userProductRepo.GetUserProduct(appUser);

            return Ok(userProduct);
        }
    }
}