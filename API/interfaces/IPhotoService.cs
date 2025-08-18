using System;
using CloudinaryDotNet.Actions;

namespace API.interfaces;

public interface IPhotoService
{
    // ImageUploadResult data type contains information about the uploaded image (come from Cloudinary)
    // IFormFile file upload from the client side
    Task<ImageUploadResult> UploadPhotoAsync(IFormFile file);
    Task<DeletionResult> DeletePhotoAsync(string publicId);
}
