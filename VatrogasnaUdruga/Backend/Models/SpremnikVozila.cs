using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VatrogasnaUdruga.Backend.Models;

public partial class SpremnikVozila : Entitet
{
    [ForeignKey("Spremnik")]
    public int SifraSpremnika { get; set; }
    [ForeignKey("Vozila")]
    public int SifraVozila { get; set; }
    [JsonIgnore]
    public virtual Spremnik SifraSpremnikaNavigation { get; set; } = null!;
    [JsonIgnore]
    public virtual Vozila SifraVozilaNavigation { get; set; } = null!;
}
