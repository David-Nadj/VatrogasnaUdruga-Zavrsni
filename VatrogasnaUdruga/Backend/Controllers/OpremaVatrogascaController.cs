using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.OpremaVatrogascas);
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
        public IActionResult DodajOpremuVatrogascu([FromBody] OpremaVatrogscaDTO opremaVatrogasca)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (opremaVatrogasca.Kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }

            var oprema = _context.Opremas.Find(opremaVatrogasca.SifraOpreme);

            if (oprema == null)
            {
                return NotFound(new { message = "Sifra opreme nije pronađena" });
            }

            var vatrogasac = _context.Vatrogasacs.Find(opremaVatrogasca.SifraVatrogasca);

            if (vatrogasac == null)
            {
                return NotFound(new { message = "Sifra vatrogasca nije pronađena" });
            }

            var postojece = _context.OpremaVatrogascas.
                FirstOrDefault(os => os.SifraOpreme == opremaVatrogasca.SifraOpreme && os.SifraVatrogasca == opremaVatrogasca.SifraVatrogasca);
        
            if (postojece != null)
            {
                postojece.Kolicina += opremaVatrogasca.Kolicina;

                _context.OpremaVatrogascas.Update(postojece);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, postojece);
            }
            else
            {
                var novo = new OpremaVatrogasca
                {
                    SifraOpreme = opremaVatrogasca.SifraOpreme,
                    SifraVatrogasca = opremaVatrogasca.SifraVatrogasca,
                    Kolicina = opremaVatrogasca.Kolicina
                };

                _context.OpremaVatrogascas.Add(novo);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, novo);
            }
        }

        [HttpPut]
        [Route("urediVezu")]
        public IActionResult UrediVezuVatrogascaIOpreme([FromBody] OpremaVatrogscaDTO uredeno)
        {
            var postojece = _context.OpremaVatrogascas.           
                FirstOrDefault(os => os.SifraOpreme == uredeno.SifraOpreme && os.SifraVatrogasca == uredeno.SifraVatrogasca);
            ;
            if (postojece == null)
            {
                return NotFound(new { message = "Veza opreme i vatrogasca nije pronađena" });
            }

            if (uredeno.Kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }

            postojece.SifraOpreme = uredeno.SifraOpreme;
            postojece.SifraVatrogasca = uredeno.SifraVatrogasca;
            postojece.Kolicina = uredeno.Kolicina;

            _context.OpremaVatrogascas.Update(postojece);
            _context.SaveChanges();

            return Ok(postojece);
        }

        [HttpDelete]
        [Route("ukloni")]
        public IActionResult ObrisiVezu([FromBody] OpremaVatrogscaDTO poruka)
        {
            var postojece = _context.OpremaVatrogascas.
                FirstOrDefault(os => os.SifraOpreme == poruka.SifraOpreme && os.SifraVatrogasca == poruka.SifraVatrogasca);
            ;
            if (postojece == null)
            {
                return NotFound(new { message = "Veza opreme i vatrogasca nije pronađena" });
            }

            _context.OpremaVatrogascas.Remove(postojece);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno uklonjena iz skladišta" });
        }
    }
}