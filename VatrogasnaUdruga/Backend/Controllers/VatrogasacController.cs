using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VatrogasacController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public VatrogasacController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSveVatrogasce()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.Vatrogasacs);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiVatrogasca(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vatrogasac = _context.Vatrogasacs.Find(sifra);

            if (vatrogasac == null)
            {
                return NotFound(new { message = "Vatrogasac nije pronađena" });
            }

            return Ok(vatrogasac);
        }
        [HttpGet]
        [Route("naziv/{naziv}")]
        public IActionResult DohvatiVatrogasca(String naziv)
        {
            var vatrogasac = _context.Vatrogasacs.Where(f => ((f.Ime +" "+ f.Prezime)).Contains(naziv)).ToList();

            if (!vatrogasac.Any())
            {
                return NotFound(new { message = "vatrogasac nije pronađen" });
                
            }

            return Ok(vatrogasac);
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiVatrogasca(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vatrogasac = _context.Vatrogasacs.Find(sifra);

            if (vatrogasac == null)
            {
                return NotFound(new { message = "Vatrogasac nije pronađen" });
            }

            _context.Vatrogasacs.Remove(vatrogasac);
            _context.SaveChanges();

            return Ok(new { message = "Vatrogasac uspješno obrisan" });
        }

        [HttpPost]
        public IActionResult KreirajNovogVatrogasca(String ime, String prezime, String brojTelefona, int? godinaRodenja)
        {
            var noviVatrogasac = new Vatrogasac
            {
                Ime = ime,
                Prezime = prezime,
                BrojTelefona = brojTelefona,
                GodinaRodenja= godinaRodenja
            };

            if (noviVatrogasac == null)
            {
                return NoContent();
            }

            _context.Vatrogasacs.Add(noviVatrogasac);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, noviVatrogasac);
        }
    }
}