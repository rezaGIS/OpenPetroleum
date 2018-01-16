using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OpenPetroleum.Controllers
{
    public class AdminController : Controller
    {
        //[Authorize]
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }
    }
}