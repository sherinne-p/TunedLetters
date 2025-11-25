using Microsoft.AspNetCore.Mvc;

namespace TunedLetters.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();

        public IActionResult Playlists() => View();

        public IActionResult Songs() => View();

        public IActionResult Contact() => View();
    }
}
