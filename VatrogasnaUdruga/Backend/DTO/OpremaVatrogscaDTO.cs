using System.ComponentModel.DataAnnotations.Schema;

namespace VatrogasnaUdruga.Backend.DTO
{
    public class OpremaVatrogscaDTO
    {
        public int SifraVatrogasca { get; set; }
        public int SifraOpreme { get; set; }
        public int Kolicina { get; set; }
    }
}
