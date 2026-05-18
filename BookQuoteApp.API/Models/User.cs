using System.ComponentModel.DataAnnotations;

namespace BookQuoteApp.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public ICollection<Book> Books { get; set; } = new List<Book>();
        public ICollection<Quote> Quotes { get; set; } = new List<Quote>();
    }

    
}
