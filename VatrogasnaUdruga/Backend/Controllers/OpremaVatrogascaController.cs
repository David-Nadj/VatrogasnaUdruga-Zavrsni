using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OpremaVatrogascaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public OpremaVatrogascaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSvuOpremuVatrogasca()
        {
            var all = _context.OpremaVatrogascas
            .Select(v => new
            {
                Vatrogasac = _context.Vatrogasacs
                            .Where(o => o.Sifra == v.SifraVatrogasca)
                            .Select(o => (o.Ime + " " + o.Prezime))
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
        public IActionResult DohvatiOpremuVatrogasca(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaVatrogasca = _context.OpremaVatrogascas
                .Where(f => f.SifraVatrogasca == sifra)
                .ToList();

            if (!opremaVatrogasca.Any())
            {
                return NotFound(new { message = "Veza između opreme i vatrogasca nije pronađena" });
            }

            return Ok(opremaVatrogasca);
        }
        
        [HttpGet]
        [Route("vatrogasac/{naziv}")]
        public IActionResult DohvatiOpremuVatrogasca(String naziv)
        {
            var sifraVatrogasca = _context.Vatrogasacs
                .Where(f => (f.Ime+" "+f.Prezime).Contains(naziv))
                .Select(f => f.Sifra)
                .ToList();

            if (!sifraVatrogasca.Any())
            {
                sifraVatrogasca = _context.Vatrogasacs
                    .Where(f => (f.Prezime + " " + f.Ime).Contains(naziv))
                    .Select(f => f.Sifra)
                    .ToList();

                if (!sifraVatrogasca.Any())
                {
                    return NotFound(new { message = "Vatrogasac nije pronađen" });
                }
            }

            var vezaSifra = _context.OpremaVatrogascas
                .Where(f => sifraVatrogasca.Contains(f.SifraVatrogasca))
                .Select(f => f.Sifra)
                .ToList();

            if (!vezaSifra.Any())
            {
                return NotFound(new { message = "Vatrogasac nema opremu" });
            }

            var opreme = _context.OpremaVatrogascas
                .Where(f => sifraVatrogasca.Contains(f.SifraVatrogasca))
                .Select(v => new
                {
                    Vatrogasac = _context.Vatrogasacs
                                .Where(o => o.Sifra == v.SifraVatrogasca)
                                .Select(o => (o.Ime + " " + o.Prezime))
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
        public IActionResult ObrisiOpremuVatrogasca(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaVatrogasca = _context.OpremaVatrogascas.Find(sifra);

            if (opremaVatrogasca == null)
            {
                return NotFound(new { message = "Veza između opreme i vatrogasca nije pronađena" });
            }

            _context.OpremaVatrogascas.Remove(opremaVatrogasca);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno uklonjena iz opreme vatrogasca" });
        }


        
        [HttpPost]
        [Route("dodaj")]
        public IActionResult DodajOpremuVatrogascu(String nazivVatrogasca, String nazivOpreme, int kolicina)
        {
            if (kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }
            var vatrogasac = _context.Vatrogasacs
                .Where(f => (f.Ime + " " + f.Prezime).Contains(nazivVatrogasca))
                .FirstOrDefault();

            if (vatrogasac == null)
            {
                vatrogasac = _context.Vatrogasacs
                .Where(f => (f.Prezime + " " + f.Ime).Contains(nazivVatrogasca))
                .FirstOrDefault();
                if(vatrogasac == null)
                {
                    return NotFound(new { message = "Vatrogasac nije pronađen" });
                }
            }
            int sifraVatrogasca = vatrogasac.Sifra;
            
            var oprema = _context.Opremas
                .Where(f => f.Naziv.Contains(nazivOpreme))
                .FirstOrDefault();

            if (oprema == null)
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }
            int sifraOpreme = oprema.Sifra;

            var novaVeza = new OpremaVatrogasca
            {
                SifraVatrogasca = sifraVatrogasca,
                SifraOpreme = sifraOpreme,
                Kolicina = kolicina
            };

            if (novaVeza == null)
            {
                return NoContent();
            }

            _context.OpremaVatrogascas.Add(novaVeza);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaVeza);
        }
    }
}