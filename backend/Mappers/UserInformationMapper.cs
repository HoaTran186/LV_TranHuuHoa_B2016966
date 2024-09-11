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
                Age = userInformationModel.Age,
                Job = userInformationModel.Job,
                Address = userInformationModel.Address,
                Phone = userInformationModel.Phone,
                UserId = userInformationModel.UserId
            };
        }
        public static UserInformation ToUserInformationFromCreateDto(this CreateUserInformationDto createUserInfo, string userId)
        {
            return new UserInformation
            {
                FullName = createUserInfo.FullName,
                Job = createUserInfo.Job,
                Age = createUserInfo.Age,
                Address = createUserInfo.Address,
                Phone = createUserInfo.Phone,
                UserId = userId
            };
        }
        public static UserInformation ToUserInformationFromUpdateDto(this UpdateUserInformationDto updateUserInfor, string userId)
        {
            return new UserInformation
            {
                FullName = updateUserInfor.FullName,
                Job = updateUserInfor.Job,
                Age = updateUserInfor.Age,
                Address = updateUserInfor.Address,
                Phone = updateUserInfor.Phone,
                UserId = userId
            };
        }
    }
}