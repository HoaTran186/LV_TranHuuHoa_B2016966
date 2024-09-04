using backend.Interfaces;

namespace backend.Service
{
    public class FileService(IWebHostEnvironment environment) : IFileService
    {
        public void DeleteFile(string fileNameWithExtension)
        {
            if(string.IsNullOrEmpty(fileNameWithExtension))
            {
                throw new ArgumentNullException(nameof(fileNameWithExtension));
            }
            var contentPath = environment.ContentRootPath;
            var path = Path.Combine(contentPath, $"Uploads",fileNameWithExtension);
            if(!File.Exists(path))
            {
                throw new ArgumentNullException($"Invalid file path");
            }
            File.Delete(path);
        }

        public async Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedFileExtension)
        {
            if(imageFile == null)
            {
                 throw new ArgumentNullException(nameof(imageFile));
            }
            var contentPath = environment.ContentRootPath;
            var path = Path.Combine(contentPath,"Uploads");
            if(!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var ext = Path.GetExtension(imageFile.FileName);
            if(!allowedFileExtension.Contains(ext))
            {
                throw new ArgumentNullException($"Only {string.Join(",",allowedFileExtension)} are allowed");
            }
            var fileName = $"{Guid.NewGuid().ToString()} {ext}";
            var fileNamePath = Path.Combine(path, fileName);
            using var stream = new FileStream(fileNamePath,FileMode.Create);
            await imageFile.CopyToAsync(stream);
            return fileName;
        }
    }
}