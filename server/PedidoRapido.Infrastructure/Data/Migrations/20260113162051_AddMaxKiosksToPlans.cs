using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PedidoRapido.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMaxKiosksToPlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "max_kiosks",
                table: "plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "max_kiosks",
                table: "plans");
        }
    }
}
