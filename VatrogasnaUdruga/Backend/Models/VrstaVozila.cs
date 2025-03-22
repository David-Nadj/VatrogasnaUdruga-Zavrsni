using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace VatrogasnaUdruga.Backend.Models;

public partial class VrstaVozila : Entitet
{
    public string Vrsta { get; set; } = null!;
    [JsonIgnore]
    public virtual ICollection<Vozila> Vozilas { get; set; } = new List<Vozila>();
}
