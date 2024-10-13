using backend.Dtos.Forum.ForumImages;
using backend.Models;

namespace backend.Mappers
{
    public static class ForumImagesMapper
    {
        public static ForumImagesDto ToForumImagesDto(this ForumImages forumImagesModel)
        {
            return new ForumImagesDto
            {
                Id = forumImagesModel.Id,
                Images = forumImagesModel.Images,
                ForumId = forumImagesModel.ForumId
            };
        }
        public static ForumImages ToForumImagesFromCreate(this CreateForumImagesDto ForumImagesModel, int ForumId)
        {
            return new ForumImages
            {
                Images = ForumImagesModel.Images.ToString(),
                ForumId = ForumId
            };
        }
    }
}