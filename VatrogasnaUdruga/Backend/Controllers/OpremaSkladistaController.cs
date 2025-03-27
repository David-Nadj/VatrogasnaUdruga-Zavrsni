using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VatrogasnaUdruga.Backend.Data;
using VatrogasnaUdruga.Backend.DTO;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return new JsonResult(_context.OpremaSkladistas);
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
        {
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
        [Route("dodaj")]
        public IActionResult KreirajNovuVezuSkladistaIOpreme([FromBody] OpremaSkladistaDTO opremaSkladista)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (opremaSkladista.Kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }

            var oprema = _context.Opremas.Find(opremaSkladista.SifraOpreme);

            if (oprema == null)
            {
                return NotFound(new { message = "Sifra opreme nije pronađena" });
            }

            var spremnik = _context.Skladistes.Find(opremaSkladista.SifraSkladista);

            if (spremnik == null)
            {
                return NotFound(new { message = "Sifra skladista nije pronađena" });
            }

            var postojece = _context.OpremaSkladistas.
                FirstOrDefault(os => os.SifraOpreme == opremaSkladista.SifraOpreme && os.SifraSkladista == opremaSkladista.SifraSkladista);

            if (postojece != null)
            {
                postojece.Kolicina += opremaSkladista.Kolicina;

                _context.OpremaSkladistas.Update(postojece);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, postojece);
            }
            else
            {
                var novo = new OpremaSkladista
                {
                    SifraSkladista = opremaSkladista.SifraSkladista,
                    SifraOpreme = opremaSkladista.SifraOpreme,
                    Kolicina = opremaSkladista.Kolicina
                };

                _context.OpremaSkladistas.Add(novo);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, novo);
            }
        }

        [HttpPut]
        [Route("urediVezu")]
        public IActionResult UrediVezuSkladistaIOpreme([FromBody] OpremaSkladistaDTO uredenaOpremaSkladista)
        {
            var opremaSkladista = _context.OpremaSkladistas.
                FirstOrDefault(os => os.SifraOpreme == uredenaOpremaSkladista.SifraOpreme && os.SifraSkladista == uredenaOpremaSkladista.SifraSkladista);
            if (opremaSkladista == null)
            {
                return NotFound(new { message = "Veza opreme i skladista nije pronađena" });
            }

            if (uredenaOpremaSkladista.Kolicina < 1)
            {
                return BadRequest(new { message = "Količina ne može biti manja od 1." });
            }
          
            opremaSkladista.SifraSkladista = uredenaOpremaSkladista.SifraSkladista;
            opremaSkladista.SifraOpreme = uredenaOpremaSkladista.SifraOpreme;
            opremaSkladista.Kolicina = uredenaOpremaSkladista.Kolicina;

            _context.OpremaSkladistas.Update(opremaSkladista);
            _context.SaveChanges();

            return Ok(opremaSkladista);
        }

        [HttpDelete]
        [Route("ukloni")]
        public IActionResult ObrisiOpremuUSpremniku([FromBody] OpremaSkladistaDTO opremaSkladista)
        {
            var pretraga = _context.OpremaSkladistas.FirstOrDefault(v => opremaSkladista.SifraSkladista == v.SifraSkladista && opremaSkladista.SifraOpreme == v.SifraOpreme);

            if (pretraga == null)
            {
                return NotFound(new { message = "Veza između spremnika i opreme nije pronađena" });
            }
            _context.OpremaSkladistas.Remove(pretraga);
            _context.SaveChanges();

            return Ok(new { message = "Oprema uspješno uklonjena iz spremnika" });
        }
    }
}