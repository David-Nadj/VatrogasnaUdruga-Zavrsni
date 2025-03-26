using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VrstaOpremeController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public VrstaOpremeController(VatrogasnaUdrugaContext context)
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
            return new JsonResult(_context.VrstaOpremes);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiVrstuOpremu(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vrstaOpreme = _context.VrstaOpremes.Find(sifra);

            if (vrstaOpreme == null)
            {
                return NotFound(new { message = "Vrsta opreme nije pronađena" });
            }

            return Ok(vrstaOpreme);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiVrstuOpreme(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vrstaOpreme = _context.VrstaOpremes.Find(sifra);

            if (vrstaOpreme == null)
            {
                return NotFound(new { message = "Vrsta opreme nije pronađena" });
            }

            _context.VrstaOpremes.Remove(vrstaOpreme);
            _context.SaveChanges();

            return Ok(new { message = "Vrsta opreme uspješno obrisana" });
        }

        [HttpPost]
        [Route("dodaj")]
        public IActionResult KreirajNovuVrstuOpreme([FromBody] VrstaOpremeDTO vrsta)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var novaVrsta = new VrstaOpreme
            {
                Vrsta = vrsta.Vrsta
            };

            if (novaVrsta == null)
            {
                return NoContent();
            }

            _context.VrstaOpremes.Add(novaVrsta);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaVrsta);
        }

        [HttpPut]
        [Route("uredi/{sifra:int}")]
        public IActionResult UrediVrstuOpreme(int sifra, [FromBody] VrstaOpremeDTO uredenaVrstaOpreme)
        {
            var vrsta = _context.VrstaOpremes.Find(sifra);
            if (vrsta == null)
            {
                return NotFound(new { message = "Vrsta nije pronađeno" });
            }

            int sifraVrste = vrsta.Sifra;

            vrsta.Vrsta = uredenaVrstaOpreme.Vrsta;

            _context.VrstaOpremes.Update(vrsta);
            _context.SaveChanges();

            return Ok(vrsta);
        }
    }
}