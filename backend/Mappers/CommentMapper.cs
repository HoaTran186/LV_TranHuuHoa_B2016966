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
                Comment = commentsModel.Comment,
                productId = commentsModel.productId,
                UserName = commentsModel.UserName
            };
        }
        public static Comments ToCommentFromCreateDto(this CreateCommentDto commentModel, int productId)
        {
            return new Comments
            {
                Comment = commentModel.Comment,
                productId = productId,
                UserName = commentModel.UserName
            };
        }
    }
}