namespace backend.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedFileExtension);
        void DeleteFile(string fileNameWithExtension);
    }
}