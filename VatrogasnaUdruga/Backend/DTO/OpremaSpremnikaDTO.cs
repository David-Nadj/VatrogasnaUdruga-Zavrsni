using System.ComponentModel.DataAnnotations.Schema;

namespace VatrogasnaUdruga.Backend.DTO
{
    public class OpremaSpremnikaDTO
    {
        public int SifraSpremnika { get; set; }
        public int SifraOpreme { get; set; }
        public int Kolicina { get; set; }
    }
}
