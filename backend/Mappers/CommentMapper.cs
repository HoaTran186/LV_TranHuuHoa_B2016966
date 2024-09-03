using backend.Dtos.Comment;
using backend.Models;

namespace backend.Mappers
{
    public static class CommentMapper
    {
        public static CommentsDto ToCommentDto(this Comments commentsModel)
        {
            return new CommentsDto
            {
                Id = commentsModel.Id,
                Title = commentsModel.Title,
                Comment = commentsModel.Comment,
                Star = commentsModel.Star,
                productId = commentsModel.productId,
                UserId = commentsModel.UserId
            };
        }
        public static Comments ToCommentFromCreateDto(this CreateCommentDto commentModel, int productId, string UserId)
        {
            return new Comments
            {
                Title = commentModel.Title,
                Comment = commentModel.Comment,
                Star = commentModel.Star,
                productId = productId,
                UserId = UserId
            };
        }
    }
}