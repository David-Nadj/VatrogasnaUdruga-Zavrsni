namespace VatrogasnaUdruga.Backend.DTO
{
    public class OpremaDTO
    {
        public string Naziv { get; set; } = null!;

        public string? Opis { get; set; }

        public DateOnly? DatumProvjereValjanosti { get; set; }

        public DateOnly? DatumKrajaValjanosti { get; set; }
    }
}
