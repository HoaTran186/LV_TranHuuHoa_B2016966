using backend.Dtos.UserInformation;
using backend.Models;

namespace backend.Mappers
{
    public static class UserInfortionMapper
    {
        public static UserInformationDto ToUserInformationDto(this UserInformation userInformationModel)
        {
            return new UserInformationDto
            {
                Id = userInformationModel.Id,
                FullName = userInformationModel.FullName,
                Job = userInformationModel.Job,
                Address = userInformationModel.Address,
                Phone = userInformationModel.Phone,
                UserId = userInformationModel.UserId
            };
        }
    }
}