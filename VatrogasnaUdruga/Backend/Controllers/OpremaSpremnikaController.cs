using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OpremaSpremnikaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public OpremaSpremnikaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSvuOpremuSpremnika()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.OpremaSpremnikas);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiOpremuSpremnika(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaSpremnika = _context.OpremaSpremnikas
                .Where(f => f.SifraSpremnika == sifra)
                .ToList();

            if (!opremaSpremnika.Any())
            {
                return NotFound(new { message = "Veza između opreme i spremnika nije pronađena" });
            }

            return Ok(opremaSpremnika);
        }
        [HttpGet]
        [Route("spremnik/{naziv}")]
        public IActionResult DohvatiOpremuUSpremniku(String naziv)
        {
            var sifraSpremnika = _context.Spremniks
                .Where(f => f.Naziv.Contains(naziv))
                .Select(f => f.Sifra)
                .ToList();

            if (!sifraSpremnika.Any())
            {
                return NotFound(new { message = "Spremnik nije pronađen" });
            }

            var vezaSifra = _context.OpremaSpremnikas
                .Where(f => sifraSpremnika.Contains(f.SifraSpremnika))
                .Select(f => f.Sifra)
                .ToList();

            if (!vezaSifra.Any())
            {
                return NotFound(new { message = "Spremnik nema opremu" });
            }

            var opreme = _context.OpremaSpremnikas
                .Where(f => sifraSpremnika.Contains(f.SifraSpremnika))
                .Select(v => new
                {
                    Spremnik = _context.Spremniks
                                .Where(o => o.Sifra == v.SifraSpremnika)
                                .Select(o => o.Naziv)
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
        public IActionResult ObrisiOpremuUSpremniku(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaSpremnika = _context.OpremaSpremnikas.Find(sifra);

            if (opremaSpremnika == null)
            {
                return NotFound(new { message = "Veza između spremnika i opreme nije pronađena" });
            }

            _context.OpremaSpremnikas.Remove(opremaSpremnika);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno uklonjena iz spremnika" });
        }

        [HttpDelete]
        [Route("ukloni")]
        public IActionResult ObrisiOpremuUSpremniku([FromBody] OpremaSpremnikaDTO opremaSpremnika)
        {
            var pretraga = _context.OpremaSpremnikas.FirstOrDefault(v => opremaSpremnika.SifraSpremnika == v.SifraSpremnika && opremaSpremnika.SifraOpreme == v.SifraOpreme);

            if(pretraga == null)
            {
                return NotFound(new { message = "Veza između spremnika i opreme nije pronađena" });
            }
            _context.OpremaSpremnikas.Remove(pretraga);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno uklonjena iz spremnika" });
        }

        [HttpPost]
        [Route("dodaj")]
        public IActionResult KreirajNovuVezuSpremnikaIOpreme([FromBody] OpremaSpremnikaDTO opremaSpremnika)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (opremaSpremnika.Kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }

            var oprema = _context.Opremas.Find(opremaSpremnika.SifraOpreme);

            if (oprema == null)
            {
                return NotFound(new { message = "Sifra opreme nije pronađena" });
            }

            var spremnik = _context.Spremniks.Find(opremaSpremnika.SifraSpremnika);

            if (spremnik == null)
            {
                return NotFound(new { message = "Sifra spremnika nije pronađena" });
            }

            var postojece = _context.OpremaSpremnikas.
                    FirstOrDefault(os => os.SifraOpreme == opremaSpremnika.SifraOpreme && os.SifraSpremnika == opremaSpremnika.SifraSpremnika);

            if (postojece != null)
            {
                postojece.Kolicina += opremaSpremnika.Kolicina;

                _context.OpremaSpremnikas.Update(postojece);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, postojece);
            }
            else
            {
                var novo = new OpremaSpremnika
                {
                    SifraSpremnika = opremaSpremnika.SifraSpremnika,
                    SifraOpreme = opremaSpremnika.SifraOpreme,
                    Kolicina = opremaSpremnika.Kolicina
                };

                _context.OpremaSpremnikas.Add(novo);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, novo);
            }
        }

        [HttpPut]
        [Route("urediVezu")]
        public IActionResult UrediVezuSpremnikaIOpreme([FromBody] OpremaSpremnikaDTO uredenaOpremaSpremnika)
        {
            var opremaSpremnika = _context.OpremaSpremnikas
                .FirstOrDefault(os => os.SifraOpreme == uredenaOpremaSpremnika.SifraOpreme && os.SifraSpremnika == uredenaOpremaSpremnika.SifraSpremnika);
            
            if (opremaSpremnika == null)
            {
                return NotFound(new { message = "Veza opreme i spremnika nije pronađeno" });
            }

            if (uredenaOpremaSpremnika.Kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }

            opremaSpremnika.SifraSpremnika = uredenaOpremaSpremnika.SifraSpremnika;
            opremaSpremnika.SifraOpreme = uredenaOpremaSpremnika.SifraOpreme;
            opremaSpremnika.Kolicina = uredenaOpremaSpremnika.Kolicina;

            _context.OpremaSpremnikas.Update(opremaSpremnika);
            _context.SaveChanges();

            return Ok(opremaSpremnika);
        }
    }
}