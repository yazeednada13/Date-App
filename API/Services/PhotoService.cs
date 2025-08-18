using System;
using API.Helpers;
using API.interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Options;

namespace API.Services;


public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        var account = new Account
        {
            Cloud = config.Value.CloudName,
            ApiKey = config.Value.ApiKey,
            ApiSecret = config.Value.ApiSecret
        };
        _cloudinary = new Cloudinary(account);
    }
    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        return await _cloudinary.DestroyAsync(deleteParams);
    }

    public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();
        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.Name, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder = "da-ang20"
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }
        return uploadResult;
    }
}
