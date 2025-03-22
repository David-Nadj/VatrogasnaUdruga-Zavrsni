using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace VatrogasnaUdruga.Backend.Models;

public partial class VrstaOpreme : Entitet
{
    public string Vrsta { get; set; } = null!;
    [JsonIgnore]
    public virtual ICollection<Oprema> Opremas { get; set; } = new List<Oprema>();
}
