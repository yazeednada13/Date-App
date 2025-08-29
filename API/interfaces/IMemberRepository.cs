using System;
using API.Entities;
using API.Helpers;

namespace API.interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<PaginatedResult<Member>> GetMemberAsync(MemberParams memberParams);
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosFromMemberAsync(string memberId);
    Task<Member?> GetMemberForUpdate(string id);

}

