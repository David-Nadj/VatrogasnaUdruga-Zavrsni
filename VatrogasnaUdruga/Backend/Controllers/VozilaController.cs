using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
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
        public IActionResult KreirajNovoVozilo(String naziv, int brojSjedala, String registracija, DateOnly? datumProizvodnje, DateOnly datumZadnjeRegistracije, String vrstaVozila)
        {
            var vrsta = _context.VrstaVozilas
                .Where(f => f.Vrsta.Contains(vrstaVozila))
                .FirstOrDefault();

            if (vrsta == null)
            {
                return NotFound(new { message = "Vrtsa vozila nije pronađena" });
            }
            int sifraVrste = vrsta.Sifra;

            var novoVozilo = new Vozila
            {
                Naziv = naziv,
                BrojSjedala = brojSjedala,
                Registracija = registracija,
                DatumProizvodnje = datumProizvodnje,
                DatumZadnjeRegistracije = datumZadnjeRegistracije,
                VrstaVozilaSifra = sifraVrste
            };

            if (novoVozilo == null)
            {
                return NoContent();
            }

            _context.Vozilas.Add(novoVozilo);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novoVozilo);
        }
    }
}