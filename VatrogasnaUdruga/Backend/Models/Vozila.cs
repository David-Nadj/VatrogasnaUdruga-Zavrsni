using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VatrogasnaUdruga.Backend.Models;

public partial class Vozila : Entitet
{
    public string Naziv { get; set; } = null!;

    public int BrojSjedala { get; set; }

    public string Registracija { get; set; } = null!;

    public DateOnly? DatumProizvodnje { get; set; }

    public DateOnly DatumZadnjeRegistracije { get; set; }
    [ForeignKey("Vozila")]
    public int VrstaVozilaSifra { get; set; }
    [JsonIgnore]
    public virtual VrstaVozila VrstaVozilaSifraNavigation { get; set; } = null!;
}
