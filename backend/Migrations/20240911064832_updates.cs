using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class updates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b9e17b5f-58f2-4183-8fa9-979d497ca6bc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bd2ffec7-81bb-451b-8879-9bc39bf91f32");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d5cfae01-eea6-46cc-a2d4-24495f2d3018");

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "User Information",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "b40d44b6-4ef4-444f-ab6d-2a1a6fef4911", null, "Creator", "CREATOR" },
                    { "c2f7976b-8f3e-4d77-8435-894e72db4f43", null, "Admin", "ADMIN" },
                    { "cf4418f4-8419-4a8c-afc0-74c55cd4c8e1", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b40d44b6-4ef4-444f-ab6d-2a1a6fef4911");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c2f7976b-8f3e-4d77-8435-894e72db4f43");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cf4418f4-8419-4a8c-afc0-74c55cd4c8e1");

            migrationBuilder.AlterColumn<string>(
                name: "Age",
                table: "User Information",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "b9e17b5f-58f2-4183-8fa9-979d497ca6bc", null, "Admin", "ADMIN" },
                    { "bd2ffec7-81bb-451b-8879-9bc39bf91f32", null, "User", "USER" },
                    { "d5cfae01-eea6-46cc-a2d4-24495f2d3018", null, "Creator", "CREATOR" }
                });
        }
    }
}
