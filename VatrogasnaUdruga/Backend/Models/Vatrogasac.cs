using System;
using System.Collections.Generic;

namespace VatrogasnaUdruga.Backend.Models;

public partial class Vatrogasac : Entitet
{
    public string Ime { get; set; } = null!;

    public string Prezime { get; set; } = null!;

    public string BrojTelefona { get; set; } = null!;

    public int? GodinaRodenja { get; set; }
}
