using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OpremaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public OpremaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSvuOpremu()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.Opremas);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiOpremu(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var oprema = _context.Opremas.Find(sifra);

            if (oprema == null)
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }

            return Ok(oprema);
        }
        [HttpGet]
        [Route("naziv/{naziv}")]
        public IActionResult DohvatiOpremu(String naziv)
        {
            var oprema = _context.Opremas.Where(f => f.Naziv.Contains(naziv)).ToList(); 

            if (!oprema.Any())
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }

            return Ok(oprema);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiOpremu(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var oprema = _context.Opremas.Find(sifra);

            if (oprema == null)
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }

            _context.Opremas.Remove(oprema);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno obrisana" });
        }

        [HttpPost]
        [Route("dodaj")]
        public IActionResult KreirajNovuOpremu(String naziv, String? opis, DateOnly? datumProvjereValjanosti, DateOnly? datumKrajaValjanosti,int vrstaOpremeSifra)
        {
            var novaOprema = new Oprema
            {
                Naziv = naziv,
                Opis = opis,
                DatumProvjereValjanosti = datumProvjereValjanosti, 
                DatumKrajaValjanosti = datumKrajaValjanosti,
                VrstaOpremeSifra = vrstaOpremeSifra // Only the foreign key
            };

            if (novaOprema == null)
            {
                return NoContent();
            }

            _context.Opremas.Add(novaOprema);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaOprema);
        }
    }
}