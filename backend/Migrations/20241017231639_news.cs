using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class news : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1abec9fe-d06b-4ac0-bd10-fc5f48c9fca0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "238fbea7-8c16-4dec-9122-a179979b1d71");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c8af4a66-83bc-4823-901a-6ae0d12bb76d");

            migrationBuilder.CreateTable(
                name: "ActiveUsers",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    HasViewed = table.Column<bool>(type: "bit", nullable: false),
                    HasPurchased = table.Column<bool>(type: "bit", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActiveUsers", x => new { x.UserId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_ActiveUsers_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ActiveUsers_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "696f22b6-8c42-46cc-8c06-1cab6d91f35e", null, "User", "USER" },
                    { "89868eca-5c5c-4cf7-97c3-c1f58dcfbb9b", null, "Creator", "CREATOR" },
                    { "dbbc4f7b-b2a4-413b-ad8a-b6981f0baabf", null, "Admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActiveUsers_AppUserId",
                table: "ActiveUsers",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActiveUsers_ProductId",
                table: "ActiveUsers",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActiveUsers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "696f22b6-8c42-46cc-8c06-1cab6d91f35e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "89868eca-5c5c-4cf7-97c3-c1f58dcfbb9b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dbbc4f7b-b2a4-413b-ad8a-b6981f0baabf");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1abec9fe-d06b-4ac0-bd10-fc5f48c9fca0", null, "User", "USER" },
                    { "238fbea7-8c16-4dec-9122-a179979b1d71", null, "Admin", "ADMIN" },
                    { "c8af4a66-83bc-4823-901a-6ae0d12bb76d", null, "Creator", "CREATOR" }
                });
        }
    }
}
