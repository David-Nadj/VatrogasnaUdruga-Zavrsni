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
    public class VrstaVozilaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public VrstaVozilaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSveVrsteVozila()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.VrstaVozilas);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiVrstuVozila(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vrstavozila = _context.VrstaVozilas.Find(sifra);

            if (vrstavozila == null)
            {
                return NotFound(new { message = "Vrsta vozila nije pronađena" });
            }

            return Ok(vrstavozila);
        }
        
        [HttpDelete]
        [Route("{sifra:int}")]
        public IActionResult ObrisiVrstuVozila(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var vrstavozila = _context.VrstaVozilas.Find(sifra);

            if (vrstavozila == null)
            {
                return NotFound(new { message = "Vrsta vozila nije pronađena" });
            }

            _context.VrstaVozilas.Remove(vrstavozila);
            _context.SaveChanges();

            return Ok(new { message = "Vrsta vozila uspješno obrisana" });
        }

        [HttpPost]
        [Route("dodaj")]
        public IActionResult KreirajNovuVrstuVozila([FromBody] VrsteVozilaDTO vrsta)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var novaVrsta = new VrstaVozila
            {
                Vrsta = vrsta.Vrsta
            };

            if (novaVrsta == null)
            {
                return NoContent();
            }

            _context.VrstaVozilas.Add(novaVrsta);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaVrsta);
        }

        [HttpPut]
        [Route("uredi/{sifra:int}")]
        public IActionResult UrediVrstuVozilo(int sifra, [FromBody] VrsteVozilaDTO uredenaVrstaVozilo)
        {
            var vrstaVozila = _context.VrstaVozilas.Find(sifra);
            if (vrstaVozila == null)
            {
                return NotFound(new { message = "Vozilo nije pronađeno" });
            }

            vrstaVozila.Vrsta = uredenaVrstaVozilo.Vrsta;

            _context.VrstaVozilas.Update(vrstaVozila);
            _context.SaveChanges();

            return Ok(vrstaVozila);
        }
    }
}