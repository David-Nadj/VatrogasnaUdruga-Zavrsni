using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
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
        [Route("dodaj")]
        public IActionResult KreirajNovogVatrogasca([FromBody] Vatrogasac vatrogasac)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var novoVatrogasac = new Vatrogasac
            {
                Ime = vatrogasac.Ime,
                Prezime = vatrogasac.Prezime,
                BrojTelefona = vatrogasac.BrojTelefona,
                GodinaRodenja = vatrogasac.GodinaRodenja
            };

            _context.Vatrogasacs.Add(novoVatrogasac);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novoVatrogasac);
        }

        [HttpPut]
        [Route("uredi/{sifra:int}")]
        public IActionResult UrediVatrogasca(int sifra, [FromBody] Vatrogasac uredeniVatrogasac)
        {
            var vatrogasac = _context.Vatrogasacs.Find(sifra);
            if (vatrogasac == null)
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });
            }

            vatrogasac.Ime = uredeniVatrogasac.Ime;
            vatrogasac.Prezime = uredeniVatrogasac.Prezime;
            vatrogasac.BrojTelefona = uredeniVatrogasac.BrojTelefona;
            vatrogasac.GodinaRodenja = uredeniVatrogasac.GodinaRodenja;

            _context.Vatrogasacs.Update(vatrogasac);
            _context.SaveChanges();

            return Ok(vatrogasac);
        }
    }
}