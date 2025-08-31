using System;
using API.Entities;
using API.Helpers;
using API.interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(DataContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
                .Where(l => l.SourceMemberId == memberId)
                .Select(x => x.TargetMemberId)
                .ToListAsync();        
    }
    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FirstOrDefaultAsync(s => s.SourceMemberId == sourceMemberId && s.TargetMemberId == targetMemberId);  
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParam likesParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likesParams.Predicate)
        {
            case "liked":
                result = query
                    .Where(x => x.SourceMemberId == likesParams.MemberId)
                    .Select(x => x.TargetMember);
                break;

            case "likedBy":
                result = query
                    .Where(x => x.TargetMemberId == likesParams.MemberId)
                    .Select(x => x.SourceMember);
                break;

            default: // mutual
                // Return targets
                var likeIds = await GetCurrentMemberLikeIds(likesParams.MemberId);

                result = query
                    .Where(x => x.TargetMemberId == likesParams.MemberId
                       && likeIds.Contains(x.SourceMemberId))
                    .Select(x => x.SourceMember);
                break;
        }
        return await PaginationHelper.CreateAsync(result, likesParams.PageNumber, likesParams.PageSize);
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
