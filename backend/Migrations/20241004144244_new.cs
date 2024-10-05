using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class @new : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "05e9c594-6172-4a56-b0e1-9bc7174ac1d9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "92caf5cd-3e90-46dd-9ee9-917ff5d9ca13");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f91315ec-f10d-4ba4-a1fb-1ea0d0dab52d");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "43840d5d-96ca-4467-b279-ebc9a7be83fb", null, "Creator", "CREATOR" },
                    { "48ef6751-be26-4534-993b-a90992385983", null, "Admin", "ADMIN" },
                    { "7962a5fd-814e-49b2-a50c-d40c597f022c", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "43840d5d-96ca-4467-b279-ebc9a7be83fb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "48ef6751-be26-4534-993b-a90992385983");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7962a5fd-814e-49b2-a50c-d40c597f022c");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "05e9c594-6172-4a56-b0e1-9bc7174ac1d9", null, "Creator", "CREATOR" },
                    { "92caf5cd-3e90-46dd-9ee9-917ff5d9ca13", null, "Admin", "ADMIN" },
                    { "f91315ec-f10d-4ba4-a1fb-1ea0d0dab52d", null, "User", "USER" }
                });
        }
    }
}
