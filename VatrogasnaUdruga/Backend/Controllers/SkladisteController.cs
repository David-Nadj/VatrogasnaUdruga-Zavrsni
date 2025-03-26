using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class SkladisteController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public SkladisteController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSvaSkladista()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.Skladistes);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiSkladiste(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var skladiste = _context.Skladistes.Find(sifra);

            if (skladiste == null)
            {
                return NotFound(new { message = "Skladište nije pronađeno" });
            }

            return Ok(skladiste);
        }
        [HttpGet]
        [Route("naziv/{naziv}")]
        public IActionResult DohvatiSkladiste(String naziv)
        {
            var skladiste = _context.Skladistes.Where(f => f.Naziv.Contains(naziv)).ToList();

            if (!skladiste.Any())
            {
                return NotFound(new { message = "Skladiste nije pronađeno" });
            }

            return Ok(skladiste);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiSkladiste(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var skladiste = _context.Skladistes.Find(sifra);

            if (skladiste == null)
            {
                return NotFound(new { message = "Skladište nije pronađeno" });
            }

            _context.Skladistes.Remove(skladiste);
            _context.SaveChanges();

            return Ok(new { message = "Skladište uspješno obrisano" });
        }

        [HttpPost]
        [Route("dodaj")]
        public IActionResult KreirajNovoSkladiste([FromBody] Skladiste skladiste)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var novoSkladiste = new Skladiste
            {
                Naziv = skladiste.Naziv,
                Adresa = skladiste.Adresa
            };

            _context.Skladistes.Add(novoSkladiste);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novoSkladiste);
        }

        [HttpPut]
        [Route("uredi/{sifra:int}")]
        public IActionResult UrediVozilo(int sifra, [FromBody] Skladiste uredenoSkladiste)
        {
            var skladiste = _context.Skladistes.Find(sifra);
            if (skladiste == null)
            {
                return NotFound(new { message = "Skladiste nije pronađeno" });
            }

            skladiste.Naziv = uredenoSkladiste.Naziv;
            skladiste.Adresa = uredenoSkladiste.Adresa;

            _context.Skladistes.Update(skladiste);
            _context.SaveChanges();

            return Ok(skladiste);
        }
    }
}