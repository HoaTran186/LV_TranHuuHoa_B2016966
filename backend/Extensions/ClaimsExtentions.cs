using System.Security.Claims;

namespace backend.Extensions
{
    public static class ClaimsExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            var claim = user?.Claims?.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"));
            return claim?.Value;
        }
    }
}