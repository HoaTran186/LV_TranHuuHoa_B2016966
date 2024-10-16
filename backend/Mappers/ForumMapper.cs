using backend.Dtos.Forum;
using backend.Models;

namespace backend.Mappers
{
    public static class ForumMapper
    {
        public static ForumDto ToForumDto(this Forum forumModel)
        {
            return new ForumDto
            {
                Id = forumModel.Id,
                Title = forumModel.Title,
                Content = forumModel.Content,
                UploadDate = forumModel.UploadDate,
                Rating = forumModel.Rating,
                Browse = forumModel.Browse,
                UserId = forumModel.UserId,
                CommentForums = forumModel.CommentForums.Select(i => i.ToCommentFOrumDto()).ToList(),
                ForumImages = forumModel.ForumImages.Select(i => i.ToForumImagesDto()).ToList()
            };
        }
        public static Forum ToForumFromCreateDto(this CreateForumDto createForumDto, string userId)
        {
            return new Forum
            {
                Title = createForumDto.Title,
                Content = createForumDto.Content,
                UploadDate = DateTime.Now,
                Rating = 0,
                Browse = false,
                UserId = userId
            };
        }
        public static Forum ToForumFromUpdateDto(this UpdateForumDto updateForumDto)
        {
            return new Forum
            {
                Title = updateForumDto.Title,
                Content = updateForumDto.Content,
                UploadDate = DateTime.Now,
            };
        }
        public static Forum ToForumFromUpdateBrowseDto(this UpdateBrowseDto updateBrowseDto)
        {
            return new Forum
            {
                Browse = true

            };
        }
    }
}