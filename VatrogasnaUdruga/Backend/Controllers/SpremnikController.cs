using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class SpremnikController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public SpremnikController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSveSpremnike()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.Spremniks);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiSpremnik(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var spremnik = _context.Spremniks.Find(sifra);

            if (spremnik == null)
            {
                return NotFound(new { message = "Spremnik nije pronađen" });
            }

            return Ok(spremnik);
        }
        [HttpGet]
        [Route("spremnik/{naziv}")]
        public IActionResult DohvatiSpremnik(String naziv)
        {
            var spremnik = _context.Spremniks.Where(f => f.Naziv.Contains(naziv)).ToList();

            if (!spremnik.Any())
            {
                return NotFound(new { message = "Spremnik nije pronađen" });
            }

            return Ok(spremnik);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiSpremnik(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var spremnik = _context.Spremniks.Find(sifra);

            if (spremnik == null)
            {
                return NotFound(new { message = "Spremnik nije pronađen" });
            }

            var spremnikVozila = _context.SpremnikVozilas.
                    Where(os => os.SifraSpremnika == sifra).ToList();

            if (spremnikVozila.Any())
            {
                _context.SpremnikVozilas.RemoveRange(spremnikVozila);
                _context.SaveChanges();
            }

            _context.Spremniks.Remove(spremnik);
            _context.SaveChanges();

            return Ok(new { message = "Spremnik uspješno obrisan" });
        }

        [HttpPost]
        [Route("dodaj")]
        public IActionResult KreirajNoviSpremnik([FromBody] Spremnik spremnik)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noviSpremnik = new Spremnik
            {
                Naziv = spremnik.Naziv
            };

            _context.Spremniks.Add(noviSpremnik);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, noviSpremnik);
        }

        [HttpPut]
        [Route("uredi/{sifra:int}")]
        public IActionResult UrediSpremnik(int sifra, [FromBody] Spremnik uredeniSpremnik)
        {
            var spremnik = _context.Spremniks.Find(sifra);
            if (spremnik == null)
            {
                return NotFound(new { message = "Spremnik nije pronađeno" });
            }

            spremnik.Naziv = uredeniSpremnik.Naziv;

            _context.Spremniks.Update(spremnik);
            _context.SaveChanges();

            return Ok(spremnik);
        }
    }
}