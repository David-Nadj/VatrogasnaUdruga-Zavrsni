using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VozilaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public VozilaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSvaVozila()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.Vozilas);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiVozila(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vozila = _context.Vozilas.Find(sifra);

            if (vozila == null)
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });
            }

            return Ok(vozila);
        }

        [HttpGet]
        [Route("nazivIliRegistracija/{text}")]
        public IActionResult DohvatiVozila(String text)
        {
            var vozila = _context.Vozilas.Where(f => ((f.Naziv)).Contains(text) || (f.Registracija).Contains(text)).ToList();

            if (!vozila.Any())
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });

            }

            return Ok(vozila);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiVozilo(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vozila = _context.Vozilas.Find(sifra);

            if (vozila == null)
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });
            }

            _context.Vozilas.Remove(vozila);
            _context.SaveChanges();

            return Ok(new { message = "Vozilo uspješno obrisano" });
        }

        [HttpPost]
        [Route("dodaj")]
        public IActionResult KreirajNovoVozilo([FromBody] VozilaDTO vozilo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vrsta = _context.VrstaVozilas
                .FirstOrDefault(f => f.Sifra == vozilo.VrstaVozilaSifra);

            if (vrsta == null)
            {
                return NotFound(new { message = "Vrsta vozila nije pronađena" });
            }

            var novoVozilo = new Vozila
            {
                Naziv = vozilo.Naziv,
                BrojSjedala = vozilo.BrojSjedala,
                Registracija = vozilo.Registracija,
                DatumProizvodnje = vozilo.DatumProizvodnje,
                DatumZadnjeRegistracije = vozilo.DatumZadnjeRegistracije,
                VrstaVozilaSifra = vozilo.VrstaVozilaSifra
            };

            _context.Vozilas.Add(novoVozilo);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novoVozilo);
        }

        [HttpPut]
        [Route("uredi/{sifra:int}")]
        public IActionResult UrediVozilo(int sifra, [FromBody] VozilaDTO uredenoVozilo)
        {
            var vozilo = _context.Vozilas.FirstOrDefault(v => v.Sifra == sifra);
            if (vozilo == null)
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });
            }

            var vrsta = _context.VrstaVozilas.FirstOrDefault(f => f.Sifra == (uredenoVozilo.VrstaVozilaSifra));
            if (vrsta == null)
            {
                return NotFound(new { message = "Vrsta vozila nije pronađena" });
            }

            vozilo.Naziv = uredenoVozilo.Naziv;
            vozilo.BrojSjedala = uredenoVozilo.BrojSjedala;
            vozilo.Registracija = uredenoVozilo.Registracija;
            vozilo.DatumProizvodnje = uredenoVozilo.DatumProizvodnje;
            vozilo.DatumZadnjeRegistracije = uredenoVozilo.DatumZadnjeRegistracije;
            vozilo.VrstaVozilaSifra = uredenoVozilo.VrstaVozilaSifra;

            _context.Vozilas.Update(vozilo);
            _context.SaveChanges();

            return Ok(vozilo);
        }
    }
}