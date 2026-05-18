using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BookQuoteApp.API.Data;
using BookQuoteApp.API.Models;

namespace BookQuoteApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class QuotesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public QuotesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userId!.Value);
        }
        [HttpGet]
        public async Task<IActionResult> GetMyQuotes()
        {
            var userId = GetUserId();
            var quotes = await _context.Quotes
                .Where(q => q.UserId == userId)
                .OrderBy(q => q.Id)
                .ToListAsync();

          
            if (!quotes.Any())
                quotes = await SeedDefaultQuotes(userId);

            return Ok(quotes);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuote(int id)
        {
            var userId = GetUserId();
            var quote = await _context.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote == null)
                return NotFound("Citatet hittades inte");
            
            return Ok(quote);
        }
        [HttpPost]
        public async Task<IActionResult> CreateQuote([FromBody] CreateQuoteRequest request)
        {
            var userId = GetUserId();
            var quite = new Quote
            {
                Text = request.Text,
                Author = request.Author,
                UserId = userId
            };

            _context.Quotes.Add(quite);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuote), new {id = quite.Id }, quite);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuote(int id, [FromBody] UpdateQuoteRequest request)
        {
            var userId = GetUserId();
            var quote = await _context.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote == null)
                return NotFound("Citatet hittades inte");

            quote.Text = request.Text;
            quote.Author = request.Author;

            await _context.SaveChangesAsync();
            return Ok(quote);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuote(int id)
        {
            var userId = GetUserId();
            var quote = await _context.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote == null)
                return NotFound("Citatet hittades inte");

            _context.Quotes.Remove(quote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private async Task<List<Quote>> SeedDefaultQuotes(int userId)
        {
            var defaultQuotes = new List<Quote>
        {
            new Quote { Text = "Var förändringen du vill se i världen", Author = "Mahatma Gandhi", UserId = userId },
            new Quote { Text = "Det är aldrig för sent att bli den man skulle kunna ha varit", Author = "George Eliot", UserId = userId },
            new Quote { Text = "En resa på tusen mil börjar med ett enda steg", Author = "Lao Tzu", UserId = userId },
            new Quote { Text = "Allt du kan tänka dig är verkligt", Author = "Pablo Picasso", UserId = userId },
            new Quote { Text = "Gör det du älskar, så kommer du aldrig att arbeta en dag i ditt liv", Author = "Confucius", UserId = userId }
        };

            _context.Quotes.AddRange(defaultQuotes);
            await _context.SaveChangesAsync();

            return defaultQuotes;
        }
    }
}

public class CreateQuoteRequest
{
    public string Text { get; set; } = string.Empty;
    public string? Author { get; set; }
}

public class UpdateQuoteRequest
{
    public string Text { get; set; } = string.Empty;
    public string? Author { get; set; }
}
