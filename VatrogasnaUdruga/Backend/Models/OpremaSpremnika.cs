using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VatrogasnaUdruga.Backend.Models;

public partial class OpremaSpremnika : Entitet
{
    [ForeignKey("Spremnik")]
    public int SifraSpremnika { get; set; }
    [ForeignKey("Oprema")]
    public int SifraOpreme { get; set; }

    public int Kolicina { get; set; }
    [JsonIgnore]
    public virtual Oprema SifraOpremeNavigation { get; set; } = null!;
    [JsonIgnore]
    public virtual Spremnik SifraSpremnikaNavigation { get; set; } = null!;
}
