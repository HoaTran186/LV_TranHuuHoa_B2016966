using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1346171e-2231-4895-88eb-c82de55eddfa", null, "Admin", "ADMIN" },
                    { "2f4215f3-9ac0-4ed8-a036-b69acd6f7c62", null, "User", "USER" },
                    { "f99ff6a6-3e79-4c3b-84fc-a85e6c853853", null, "Creator", "CREATOR" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1346171e-2231-4895-88eb-c82de55eddfa");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2f4215f3-9ac0-4ed8-a036-b69acd6f7c62");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f99ff6a6-3e79-4c3b-84fc-a85e6c853853");
        }
    }
}
