using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class SpremnikVozilaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public SpremnikVozilaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSveSpremnikeVozila()
        {
            var all = _context.SpremnikVozilas
                .Select(v => new
                {
                    Spremnik = _context.Spremniks
                                .Where(o => o.Sifra == v.SifraSpremnika)
                                .Select(o => o.Naziv)
                                .FirstOrDefault(),
                    Vozilo = _context.Vozilas
                                .Where(o => o.Sifra == v.SifraVozila)
                                .Select(o => o.Naziv)
                                .FirstOrDefault(),
                })
                .ToList();
            return Ok(all);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiSpremnikVozila(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var spremnikVozila = _context.SpremnikVozilas.Find(sifra);

            if (spremnikVozila == null)
            {
                return NotFound(new { message = "Veza između spremnika i vozila nije pronađena" });
            }

            return Ok(spremnikVozila);
        }
        [HttpGet]
        [Route("vozilo/{naziv}")]
        public IActionResult DohvatiOpremuUSpremnikuVozila(String naziv)
        {//to do
            var sifraVozila = _context.Vozilas
                .Where(f => f.Naziv.Contains(naziv))
                .Select(f => f.Sifra)
                .ToList();

            if (!sifraVozila.Any())
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });
            }

            var vezaSifra = _context.SpremnikVozilas
                .Where(f => sifraVozila.Contains(f.SifraVozila))
                .Select(t => t.SifraSpremnika)
                .ToList();

            if (!vezaSifra.Any())
            {
                return NotFound(new { message = "Nema Spremnika" });
            }

            var opreme = _context.SpremnikVozilas
                 .Where(f => sifraVozila.Contains(f.SifraVozila))
                 .SelectMany(v => _context.OpremaSpremnikas
                     .Where(o => o.SifraSpremnika == v.SifraSpremnika)
                     .Join(_context.Opremas,
                           os => os.SifraOpreme,
                           o => o.Sifra,
                           (os, o) => new
                           {
                               NazivSpremnika = _context.Spremniks
                                   .Where(s => s.Sifra == v.SifraSpremnika)
                                   .Select(s => s.Naziv)
                                   .FirstOrDefault(),
                               Naziv = o.Naziv,
                               Kolicina = os.Kolicina
                           }))
                 .ToList();

            if (!opreme.Any())
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }

            return Ok(opreme);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiSpremnikVozila(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var spremnikVozila = _context.SpremnikVozilas.Find(sifra);

            if (spremnikVozila == null)
            {
                return NotFound(new { message = "Veza između spremnika i vozila nije pronađena" });
            }

            _context.SpremnikVozilas.Remove(spremnikVozila);
            _context.SaveChanges();

            return Ok(new { message = "Spremnik Vozila je uspješno uklonjena iz vozila" });
        }



        [HttpPost]
        [Route("dodaj")]
        public IActionResult DodajSpremnikUVozilo(String nazivSpremnika, String nazivVozila)
        {
            var spremnik = _context.Spremniks
                .Where(f => f.Naziv.Contains(nazivSpremnika))
               .FirstOrDefault();

            if (spremnik == null)
            {
                return NotFound(new { message = "Spremnik nije pronađen" });
            }

            int sifraSpremnika = spremnik.Sifra;

            var vozilo = _context.Vozilas
                .Where(f => f.Naziv.Contains(nazivVozila))
                .FirstOrDefault();

            if (vozilo == null)
            {
                return NotFound(new { message = "Vozilo nije pronađen" });
            }

            int sifraVozila = vozilo.Sifra;

            var novaVeza = new SpremnikVozila
            {
                SifraSpremnika = sifraSpremnika,
                SifraVozila = sifraVozila
            };

            if (novaVeza == null)
            {
                return NoContent();
            }

            _context.SpremnikVozilas.Add(novaVeza);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaVeza);
        }
    }
}