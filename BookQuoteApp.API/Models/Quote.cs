using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookQuoteApp.API.Models
{
    public class Quote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(500)]
        public string Text { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Author { get; set; }
        
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }
    }
}
