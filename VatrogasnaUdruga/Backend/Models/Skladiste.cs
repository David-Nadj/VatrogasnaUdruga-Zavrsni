using System;
using System.Collections.Generic;

namespace VatrogasnaUdruga.Backend.Models;

public partial class Skladiste : Entitet
{
  
    public string Naziv { get; set; } = null!;

    public string? Adresa { get; set; }
}
