using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
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
        public IActionResult KreirajNovuVrstuVozila(String vrsta)
        {
            var novaVrsta = new VrstaVozila
            {
                Vrsta = vrsta,
              
            };

            if (novaVrsta == null)
            {
                return NoContent();
            }

            _context.VrstaVozilas.Add(novaVrsta);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaVrsta);
        }
    }
}