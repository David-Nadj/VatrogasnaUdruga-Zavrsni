using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
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
        public IActionResult KreirajNovuOpremu([FromBody] OpremaDTO oprema)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vrsta = _context.VrstaOpremes.Find(oprema.VrstaOpremeSifra);

            if (vrsta == null)
            {
                return NotFound(new { message = "Vrsta opreme nije pronađena" });
            }

            var novaOprema = new Oprema
            {
                Naziv = oprema.Naziv,
                Opis = oprema.Opis,
                DatumProvjereValjanosti = oprema.DatumProvjereValjanosti,
                DatumKrajaValjanosti = oprema.DatumKrajaValjanosti,
                VrstaOpremeSifra = oprema.VrstaOpremeSifra,
            };

            _context.Opremas.Add(novaOprema);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaOprema);
        }

        [HttpPut]
        [Route("uredi/{sifra:int}")]
        public IActionResult UrediOpremu(int sifra, [FromBody] OpremaDTO uredenaOprema)
        {
            var oprema = _context.Opremas.Find(sifra);
            if (oprema == null)
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });
            }

            var vrsta = _context.VrstaOpremes.Find(uredenaOprema.VrstaOpremeSifra);
            if (vrsta == null)
            {
                return NotFound(new { message = "Vrsta opreme nije pronađena" });
            }

            oprema.Naziv = uredenaOprema.Naziv;
            oprema.Opis = uredenaOprema.Opis;
            oprema.DatumProvjereValjanosti = uredenaOprema.DatumProvjereValjanosti;
            oprema.DatumKrajaValjanosti = uredenaOprema.DatumKrajaValjanosti;
            oprema.VrstaOpremeSifra = uredenaOprema.VrstaOpremeSifra;

            _context.Opremas.Update(oprema);
            _context.SaveChanges();

            return Ok(oprema);
        }
    }
}