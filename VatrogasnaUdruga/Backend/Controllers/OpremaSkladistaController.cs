using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OpremaSkladistaController : Controller
    {
        private readonly VatrogasnaUdrugaContext _context;

        public OpremaSkladistaController(VatrogasnaUdrugaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult DohvatiSvuOpremu()
        {
            var all = _context.OpremaSkladistas
                .Select(v => new
                {
                    Skladiste = _context.Skladistes
                                .Where(o => o.Sifra == v.SifraSkladista)
                                .Select(o => o.Naziv)
                                .FirstOrDefault(),
                    Oprema = _context.Opremas
                                .Where(o => o.Sifra == v.SifraOpreme)
                                .Select(o => o.Naziv)
                                .FirstOrDefault(),
                    KolicinaOpreme = v.Kolicina
                })
                .ToList();
            return Ok(all);
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult DohvatiOpremuSkladista(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaSkladista = _context.OpremaSkladistas
                .Where(f => f.SifraSkladista==sifra)
                .ToList();

            if (!opremaSkladista.Any())
            {
                return NotFound(new { message = "Veza između opreme i skladišta nije pronađena" });
            }

            return Ok(opremaSkladista);
        }
        [HttpGet]
        [Route("skladiste/{naziv}")]
        public IActionResult DohvatiOpremuUSkladistu(String naziv)
        {//to do
            var sifraSkladista = _context.Skladistes
                .Where(f => f.Naziv.Contains(naziv))
                .Select(f => f.Sifra)  
                .ToList();

            if (!sifraSkladista.Any())
            {
                return NotFound(new { message = "Skladište nije pronađeno" });
            }

            var vezaSifra = _context.OpremaSkladistas
                .Where(f => sifraSkladista.Contains(f.SifraSkladista))
                .Select(f => f.Sifra)
                .ToList();

            if (!vezaSifra.Any())
            {
                return NotFound(new { message = "Skladište nema opremu" });
            }

            var opreme = _context.OpremaSkladistas
                .Where(f => sifraSkladista.Contains(f.SifraSkladista))
                .Select(v => new
                {
                    Skladiste= _context.Skladistes
                                .Where(o => o.Sifra == v.SifraSkladista)
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
        public IActionResult ObrisiOpremu(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { message = "Šifra nije validna" });
            }
            var opremaSkladista = _context.OpremaSkladistas.Find(sifra);

            if (opremaSkladista == null)
            {
                return NotFound(new { message = "Veza između opreme i skladišta nije pronađena" });
            }

            _context.OpremaSkladistas.Remove(opremaSkladista);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno uklonjena iz skladišta" });
        }



        [HttpPost]
        public IActionResult DodajOpremuUSkladiste(String nazivSkladista,String nazivOpreme,int kolicina)
        {
            if (kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }
            var skladiste = _context.Skladistes
                .Where(f => f.Naziv.Contains(nazivSkladista))
                .FirstOrDefault();

            if (skladiste == null)
            {
                return NotFound(new { message = "Skladište nije pronađeno" });
            }
            int sifraSkladista = skladiste.Sifra;

            var oprema = _context.Opremas
                .Where(f => f.Naziv.Contains(nazivOpreme))
                .FirstOrDefault();

            if (oprema == null)
            {
                return NotFound(new { message = "Oprema nije pronađena" });
            }
            int sifraOpreme = oprema.Sifra;

            var novaVeza = new OpremaSkladista
            {
                SifraSkladista = sifraSkladista,
                SifraOpreme = sifraOpreme,
                Kolicina = kolicina
            };

            if (novaVeza == null)
            {
                return NoContent();
            }

            _context.OpremaSkladistas.Add(novaVeza);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, novaVeza);
        }
    }
}