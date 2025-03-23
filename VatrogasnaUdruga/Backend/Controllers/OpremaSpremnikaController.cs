using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OpremaSpremnikaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public OpremaSpremnikaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSvuOpremuSpremnika()
        {
            var all = _context.OpremaSpremnikas
            .Select(v => new
                {
                Spremnik = _context.Spremniks
                            .Where(o => o.Sifra == v.SifraSpremnika)
                            .Select(o => o.Naziv)
                            .FirstOrDefault(),
                Oprema = _context.Opremas
                            .Where(o => o.Sifra == v.SifraOpreme)
                            .Select(o => o.Naziv)
                            .FirstOrDefault(),
                KolicinaOpreme = v.Kolicina
            })
            .ToList();
            return Ok(all);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiOpremuSpremnika(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaSpremnika = _context.OpremaSpremnikas
                .Where(f => f.SifraSpremnika == sifra)
                .ToList();

            if (!opremaSpremnika.Any())
            {
                return NotFound(new { message = "Veza između opreme i spremnika nije pronađena" });
            }

            return Ok(opremaSpremnika);
        }
        [HttpGet]
        [Route("spremnik/{naziv}")]
        public IActionResult DohvatiOpremuUSpremniku(String naziv)
        {
            var sifraSpremnika = _context.Spremniks
                .Where(f => f.Naziv.Contains(naziv))
                .Select(f => f.Sifra)
                .ToList();

            if (!sifraSpremnika.Any())
            {
                return NotFound(new { message = "Spremnik nije pronađen" });
            }

            var vezaSifra = _context.OpremaSpremnikas
                .Where(f => sifraSpremnika.Contains(f.SifraSpremnika))
                .Select(f => f.Sifra)
                .ToList();

            if (!vezaSifra.Any())
            {
                return NotFound(new { message = "Spremnik nema opremu" });
            }

            var opreme = _context.OpremaSpremnikas
                .Where(f => sifraSpremnika.Contains(f.SifraSpremnika))
                .Select(v => new
                {
                    Spremnik = _context.Spremniks
                                .Where(o => o.Sifra == v.SifraSpremnika)
                                .Select(o => o.Naziv)
                                .FirstOrDefault(),
                    Oprema = _context.Opremas
                                .Where(o => o.Sifra == v.SifraOpreme)
                                .Select(o => o.Naziv)
                                .FirstOrDefault(),
                    Kolicina = v.Kolicina
                })
                .ToList();

            if (!opreme.Any())
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }

            return Ok(opreme);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiOpremuUSpremniku(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaSpremnika = _context.OpremaSpremnikas.Find(sifra);

            if (opremaSpremnika == null)
            {
                return NotFound(new { message = "Veza između spremnika i opreme nije pronađena" });
            }

            _context.OpremaSpremnikas.Remove(opremaSpremnika);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno uklonjena iz spremnika" });
        }



        [HttpPost]
        [Route("dodaj")]
        public IActionResult DodajOpremuUSpremnik(String nazivSpremnika, String nazivOpreme, int kolicina)
        {
            if (kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }
            var spremnik = _context.Spremniks
                .Where(f => f.Naziv.Contains(nazivSpremnika))
                .FirstOrDefault();

            if (spremnik == null)
            {
                return NotFound(new { message = "Spremnik nije pronađen" });
            }
            int sifraSpremnika = spremnik.Sifra;

            var oprema = _context.Opremas
                .Where(f => f.Naziv.Contains(nazivOpreme))
                .FirstOrDefault();

            if (oprema == null)
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }
            int sifraOpreme = oprema.Sifra;

            var novaVeza = new OpremaSpremnika
            {
                SifraSpremnika = sifraSpremnika,
                SifraOpreme = sifraOpreme,
                Kolicina = kolicina
            };

            if (novaVeza == null)
            {
                return NoContent();
            }

            _context.OpremaSpremnikas.Add(novaVeza);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaVeza);
        }
    }
}