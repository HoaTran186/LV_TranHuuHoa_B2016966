using backend.Dtos.Forum.ForumComment;
using backend.Models;

namespace backend.Mappers
{
    public static class ForumCommentMapper
    {
        public static CommentForumDto ToCommentFOrumDto(this CommentForum commentForumModel)
        {
            return new CommentForumDto
            {
                Id = commentForumModel.Id,
                Star = commentForumModel.Star,
                Comment = commentForumModel.Comment,
                ForumId = commentForumModel.ForumId,
                DateComment = commentForumModel.DateComment,
                UserId = commentForumModel.UserId
            };
        }
        public static CommentForum ToForumCommentFromCreateDto(this CreateCommentForumDto commentModel, string userId, int forumId)
        {
            return new CommentForum
            {
                Star = commentModel.Star,
                Comment = commentModel.Comment,
                DateComment = DateTime.Now,
                ForumId = forumId,
                UserId = userId
            };
        }
        public static CommentForum ToCommentFromUpdateDto(this UpdateCommentForumDto commentMoel)
        {
            return new CommentForum
            {
                Star = commentMoel.Star,
                Comment = commentMoel.Comment,
                DateComment = DateTime.Now
            };
        }
    }
}