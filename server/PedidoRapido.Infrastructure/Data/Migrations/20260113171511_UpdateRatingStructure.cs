using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PedidoRapido.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRatingStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ratings_employees_target_id",
                table: "ratings");

            migrationBuilder.DropForeignKey(
                name: "FK_ratings_kiosks_kiosk_id",
                table: "ratings");

            migrationBuilder.DropForeignKey(
                name: "FK_ratings_menu_items_target_id",
                table: "ratings");

            migrationBuilder.DropForeignKey(
                name: "FK_ratings_users_customer_id",
                table: "ratings");

            migrationBuilder.DropIndex(
                name: "IX_ratings_target_id",
                table: "ratings");

            migrationBuilder.DropColumn(
                name: "customer_name",
                table: "ratings");

            migrationBuilder.DropColumn(
                name: "target_name",
                table: "ratings");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "ratings",
                newName: "target_type");

            migrationBuilder.RenameColumn(
                name: "customer_id",
                table: "ratings",
                newName: "menu_item_id");

            migrationBuilder.RenameIndex(
                name: "ix_ratings_type_target_id",
                table: "ratings",
                newName: "ix_ratings_target_type_id");

            migrationBuilder.RenameIndex(
                name: "ix_ratings_kiosk_id",
                table: "ratings",
                newName: "i_x_ratings_kiosk_id");

            migrationBuilder.RenameIndex(
                name: "ix_ratings_customer_id",
                table: "ratings",
                newName: "i_x_ratings_menu_item_id");

            migrationBuilder.AlterColumn<Guid>(
                name: "kiosk_id",
                table: "ratings",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "employee_id",
                table: "ratings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "user_id",
                table: "ratings",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "i_x_ratings_employee_id",
                table: "ratings",
                column: "employee_id");

            migrationBuilder.CreateIndex(
                name: "ix_ratings_score",
                table: "ratings",
                column: "score");

            migrationBuilder.CreateIndex(
                name: "ix_ratings_user_id",
                table: "ratings",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_ratings_user_target_unique",
                table: "ratings",
                columns: new[] { "user_id", "target_type", "target_id" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_employees_employee_id",
                table: "ratings",
                column: "employee_id",
                principalTable: "employees",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_kiosks_kiosk_id",
                table: "ratings",
                column: "kiosk_id",
                principalTable: "kiosks",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_menu_items_menu_item_id",
                table: "ratings",
                column: "menu_item_id",
                principalTable: "menu_items",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_users_user_id",
                table: "ratings",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ratings_employees_employee_id",
                table: "ratings");

            migrationBuilder.DropForeignKey(
                name: "FK_ratings_kiosks_kiosk_id",
                table: "ratings");

            migrationBuilder.DropForeignKey(
                name: "FK_ratings_menu_items_menu_item_id",
                table: "ratings");

            migrationBuilder.DropForeignKey(
                name: "FK_ratings_users_user_id",
                table: "ratings");

            migrationBuilder.DropIndex(
                name: "i_x_ratings_employee_id",
                table: "ratings");

            migrationBuilder.DropIndex(
                name: "ix_ratings_score",
                table: "ratings");

            migrationBuilder.DropIndex(
                name: "ix_ratings_user_id",
                table: "ratings");

            migrationBuilder.DropIndex(
                name: "ix_ratings_user_target_unique",
                table: "ratings");

            migrationBuilder.DropColumn(
                name: "employee_id",
                table: "ratings");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "ratings");

            migrationBuilder.RenameColumn(
                name: "target_type",
                table: "ratings",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "menu_item_id",
                table: "ratings",
                newName: "customer_id");

            migrationBuilder.RenameIndex(
                name: "ix_ratings_target_type_id",
                table: "ratings",
                newName: "ix_ratings_type_target_id");

            migrationBuilder.RenameIndex(
                name: "i_x_ratings_menu_item_id",
                table: "ratings",
                newName: "ix_ratings_customer_id");

            migrationBuilder.RenameIndex(
                name: "i_x_ratings_kiosk_id",
                table: "ratings",
                newName: "ix_ratings_kiosk_id");

            migrationBuilder.AlterColumn<Guid>(
                name: "kiosk_id",
                table: "ratings",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "customer_name",
                table: "ratings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "target_name",
                table: "ratings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ratings_target_id",
                table: "ratings",
                column: "target_id");

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_employees_target_id",
                table: "ratings",
                column: "target_id",
                principalTable: "employees",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_kiosks_kiosk_id",
                table: "ratings",
                column: "kiosk_id",
                principalTable: "kiosks",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_menu_items_target_id",
                table: "ratings",
                column: "target_id",
                principalTable: "menu_items",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ratings_users_customer_id",
                table: "ratings",
                column: "customer_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
