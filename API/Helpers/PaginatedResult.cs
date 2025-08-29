using System;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginationMeteData Metadata { get; set; } = default!;
    public List<T> Items { get; set; } = [];
    
}
public class PaginationMeteData
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
};

public class PaginationHelper {
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query,
        int pageNumber, int PageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * PageSize).Take(PageSize).ToListAsync();

        return new PaginatedResult<T>
        {
            Metadata = new PaginationMeteData
            {
                CurrentPage = pageNumber,
                TotalCount = count,
                TotalPages = (int)Math.Ceiling(count / (double)PageSize),
                PageSize = PageSize
            },
            Items = items
        };
    }
}

