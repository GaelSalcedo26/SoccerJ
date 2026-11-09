using System.ComponentModel.DataAnnotations;

namespace Soccer.Api.Models
{
    public class League : IValidatableObject
    {
        public int Id { get; set; }

        [RegularExpression(@".*\p{L}.*\p{L}.*", ErrorMessage = "El nombre debe tener al menos 2 letras.")]
        public string Name { get; set; } = string.Empty;

        [RegularExpression(@".*\p{L}.*\p{L}.*", ErrorMessage = "El país debe tener al menos 2 letras.")]
        public string Country { get; set; } = string.Empty;

        public DateOnly StartDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
        public DateOnly EndDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

        public bool Enabled { get; set; } = true;

        public List<LeagueTeam> LeagueTeams { get; set; } = new ();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (StartDate > EndDate)
            {
                yield return new ValidationResult(
                    "La fecha de inicio no puede ser posterior a la fecha de fin.",
                    new[] { nameof(StartDate), nameof(EndDate) });
            }
        }
    }
}
