using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VatrogasnaUdruga.Backend.Models;

public partial class Oprema:Entitet
{
  

    public string Naziv { get; set; } = null!;

    public string? Opis { get; set; }

    public DateOnly? DatumProvjereValjanosti { get; set; }

    public DateOnly? DatumKrajaValjanosti { get; set; }
    [ForeignKey("VrstaOpreme")]
    public int VrstaOpremeSifra { get; set; }
    [JsonIgnore]
    public virtual VrstaOpreme VrstaOpremeSifraNavigation { get; set; } = null!;
}
