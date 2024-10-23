using backend.Dtos.Forum.ForumImages;
using backend.Extensions;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Account
{
    [Route("api/account/forum-images")]
    [ApiController]
    public class ForumImagesController : ControllerBase
    {
        private readonly IForumRepository _forumRepo;
        private readonly IForumImagesRepository _forumImagesRepo;
        private readonly IFileService _fileService;
        private readonly UserManager<AppUser> _userManager;
        public ForumImagesController(IForumRepository forumRepo, IForumImagesRepository forumImagesRepo, IFileService fileService, UserManager<AppUser> userManager)
        {
            _forumRepo = forumRepo;
            _forumImagesRepo = forumImagesRepo;
            _fileService = fileService;
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var forumImages = await _forumImagesRepo.GetAllAsync();

                return Ok(forumImages);
            }
        }
        [HttpGet]
        [Route("{forumId:int}")]
        public async Task<IActionResult> GetByForumId([FromRoute] int forumId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var forumImages = await _forumImagesRepo.GetByForumId(forumId);
            if (forumImages == null)
            {
                return NotFound();
            }
            return Ok(forumImages);
        }
        [HttpPost]
        [Route("{forumId:int}")]
        public async Task<IActionResult> Create([FromRoute] int forumId, [FromForm] CreateForumImagesDto createForumImagesDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var forum = await _forumRepo.GetByIdAsync(forumId);
            if (forum == null)
            {
                return BadRequest("Forum does not exist");
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            if (forum.UserId != appUser.Id)
            {
                return BadRequest("You are not authorized to upload images for this forum.");
            }
            string[] allowedFileExtensions = { ".jpg", ".jpeg", ".png" };
            var createdImageNames = new List<string>();
            foreach (var image in createForumImagesDto.Images)
            {
                var createdImageName = await _fileService.SaveFileAsync(image, allowedFileExtensions);
                createdImageNames.Add(createdImageName);
                var forumModel = new ForumImages
                {
                    Images = createdImageName,
                    ForumId = forumId
                };
                await _forumImagesRepo.CreateAsync(forumModel);
            }
            return Ok(createdImageNames);
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingForumImage = await _forumImagesRepo.GetByIdAsync(id);
            if (existingForumImage == null)
            {
                return NotFound();
            }
            var forum = await _forumRepo.GetByIdAsync(existingForumImage.ForumId);
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            if (forum.UserId != appUser.Id)
            {
                return BadRequest("You are not authorized to delete images for this forum.");
            }
            var deleteResult = await _forumImagesRepo.DeleteAsync(id);
            if (deleteResult == null)
            {
                return NotFound();
            }
            _fileService.DeleteFile(existingForumImage.Images);
            return Ok("Deleted forum images");
        }
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> DeleteAdmin([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingForumImage = await _forumImagesRepo.GetByIdAsync(id);
            if (existingForumImage == null)
            {
                return NotFound();
            }
            var deleteResult = await _forumImagesRepo.DeleteAsync(id);
            if (deleteResult == null)
            {
                return NotFound();
            }
            _fileService.DeleteFile(existingForumImage.Images);
            return Ok("Deleted forum images");
        }
        [HttpDelete("delete-all/{forumId}")]
        public async Task<IActionResult> DeleteAll([FromRoute] int forumId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var forum = await _forumRepo.GetByIdAsync(forumId);
            if (forum == null)
            {
                return NotFound("Forum does not exist");
            }
            var forumImages = await _forumImagesRepo.GetByForumId(forumId);
            if (forumImages == null || !forumImages.Any())
            {
                return NotFound("No images found for this forum.");
            }
            foreach (var image in forumImages)
            {
                _fileService.DeleteFile(image.Images);
                await _forumImagesRepo.DeleteAsync(image.Id);
            }
            return Ok("Deleted all forum images");
        }
    }
}