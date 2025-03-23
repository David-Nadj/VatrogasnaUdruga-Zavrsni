namespace VatrogasnaUdruga.Backend.DTO
{
    public class VozilaDTO
    {
        public string Naziv { get; set; } = null!;
        public int BrojSjedala { get; set; }
        public string Registracija { get; set; } = null!;
        public DateOnly? DatumProizvodnje { get; set; }
        public DateOnly DatumZadnjeRegistracije { get; set; }
        public int VrstaVozilaSifra { get; set; }
    }
}
