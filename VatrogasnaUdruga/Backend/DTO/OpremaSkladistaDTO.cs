using System.ComponentModel.DataAnnotations.Schema;

namespace VatrogasnaUdruga.Backend.DTO
{
    public class OpremaSkladistaDTO
    {
        public int SifraSkladista { get; set; }
        public int SifraOpreme { get; set; }
        public int Kolicina { get; set; }
    }
}
