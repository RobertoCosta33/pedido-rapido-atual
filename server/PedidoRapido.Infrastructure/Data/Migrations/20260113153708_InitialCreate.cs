using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PedidoRapido.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "plans",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    slug = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    monthly_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    semiannual_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    annual_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    max_products = table.Column<int>(type: "integer", nullable: false),
                    max_orders_per_month = table.Column<int>(type: "integer", nullable: false),
                    max_employees = table.Column<int>(type: "integer", nullable: false),
                    has_stock_management = table.Column<bool>(type: "boolean", nullable: false),
                    has_employee_management = table.Column<bool>(type: "boolean", nullable: false),
                    has_public_ranking = table.Column<bool>(type: "boolean", nullable: false),
                    has_analytics = table.Column<bool>(type: "boolean", nullable: false),
                    has_priority_support = table.Column<bool>(type: "boolean", nullable: false),
                    is_highlighted_in_ranking = table.Column<bool>(type: "boolean", nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    is_popular = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_plans", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    kiosk_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    document = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    hire_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    salary = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    work_schedule = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    photo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    average_rating = table.Column<double>(type: "double precision", precision: 3, scale: 2, nullable: false),
                    total_ratings = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_employees", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "kiosks",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    logo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    cover_image = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    street = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    complement = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    neighborhood = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    state = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    zip_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    whats_app = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    instagram = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    allow_online_orders = table.Column<bool>(type: "boolean", nullable: false),
                    estimated_prep_time = table.Column<int>(type: "integer", nullable: false),
                    owner_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_kiosks", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "menu_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    kiosk_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    image = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    is_available = table.Column<bool>(type: "boolean", nullable: false),
                    preparation_time = table.Column<int>(type: "integer", nullable: false),
                    average_rating = table.Column<double>(type: "double precision", precision: 3, scale: 2, nullable: false),
                    total_ratings = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_menu_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_menu_items_kiosks_kiosk_id",
                        column: x => x.kiosk_id,
                        principalTable: "kiosks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "subscriptions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    kiosk_id = table.Column<Guid>(type: "uuid", nullable: false),
                    plan_id = table.Column<Guid>(type: "uuid", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    billing_cycle = table.Column<string>(type: "text", nullable: false),
                    start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    expiry_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    auto_renew = table.Column<bool>(type: "boolean", nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    total_paid = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_subscriptions", x => x.id);
                    table.ForeignKey(
                        name: "FK_subscriptions_kiosks_kiosk_id",
                        column: x => x.kiosk_id,
                        principalTable: "kiosks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_subscriptions_plans_plan_id",
                        column: x => x.plan_id,
                        principalTable: "plans",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    kiosk_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_users", x => x.id);
                    table.ForeignKey(
                        name: "FK_users_kiosks_kiosk_id",
                        column: x => x.kiosk_id,
                        principalTable: "kiosks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ratings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    kiosk_id = table.Column<Guid>(type: "uuid", nullable: false),
                    customer_id = table.Column<Guid>(type: "uuid", nullable: true),
                    customer_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    target_id = table.Column<Guid>(type: "uuid", nullable: false),
                    target_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    score = table.Column<int>(type: "integer", nullable: false),
                    comment = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_ratings", x => x.id);
                    table.ForeignKey(
                        name: "FK_ratings_employees_target_id",
                        column: x => x.target_id,
                        principalTable: "employees",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ratings_kiosks_kiosk_id",
                        column: x => x.kiosk_id,
                        principalTable: "kiosks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ratings_menu_items_target_id",
                        column: x => x.target_id,
                        principalTable: "menu_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ratings_users_customer_id",
                        column: x => x.customer_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "ix_employees_is_active",
                table: "employees",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "ix_employees_kiosk_id",
                table: "employees",
                column: "kiosk_id");

            migrationBuilder.CreateIndex(
                name: "ix_employees_role",
                table: "employees",
                column: "role");

            migrationBuilder.CreateIndex(
                name: "ix_kiosks_city",
                table: "kiosks",
                column: "city");

            migrationBuilder.CreateIndex(
                name: "ix_kiosks_is_active",
                table: "kiosks",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "ix_kiosks_owner_id",
                table: "kiosks",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_kiosks_slug",
                table: "kiosks",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_menu_items_category",
                table: "menu_items",
                column: "category");

            migrationBuilder.CreateIndex(
                name: "ix_menu_items_is_active",
                table: "menu_items",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "ix_menu_items_is_available",
                table: "menu_items",
                column: "is_available");

            migrationBuilder.CreateIndex(
                name: "ix_menu_items_kiosk_id",
                table: "menu_items",
                column: "kiosk_id");

            migrationBuilder.CreateIndex(
                name: "ix_plans_display_order",
                table: "plans",
                column: "display_order");

            migrationBuilder.CreateIndex(
                name: "ix_plans_is_active",
                table: "plans",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "ix_plans_slug",
                table: "plans",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_ratings_created_at",
                table: "ratings",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_ratings_customer_id",
                table: "ratings",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "ix_ratings_kiosk_id",
                table: "ratings",
                column: "kiosk_id");

            migrationBuilder.CreateIndex(
                name: "IX_ratings_target_id",
                table: "ratings",
                column: "target_id");

            migrationBuilder.CreateIndex(
                name: "ix_ratings_type_target_id",
                table: "ratings",
                columns: new[] { "type", "target_id" });

            migrationBuilder.CreateIndex(
                name: "ix_subscriptions_expiry_date",
                table: "subscriptions",
                column: "expiry_date");

            migrationBuilder.CreateIndex(
                name: "ix_subscriptions_kiosk_id",
                table: "subscriptions",
                column: "kiosk_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_subscriptions_plan_id",
                table: "subscriptions",
                column: "plan_id");

            migrationBuilder.CreateIndex(
                name: "ix_subscriptions_status",
                table: "subscriptions",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_kiosk_id",
                table: "users",
                column: "kiosk_id");

            migrationBuilder.CreateIndex(
                name: "ix_users_role",
                table: "users",
                column: "role");

            migrationBuilder.AddForeignKey(
                name: "FK_employees_kiosks_kiosk_id",
                table: "employees",
                column: "kiosk_id",
                principalTable: "kiosks",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_kiosks_users_owner_id",
                table: "kiosks",
                column: "owner_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_kiosks_kiosk_id",
                table: "users");

            migrationBuilder.DropTable(
                name: "ratings");

            migrationBuilder.DropTable(
                name: "subscriptions");

            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "menu_items");

            migrationBuilder.DropTable(
                name: "plans");

            migrationBuilder.DropTable(
                name: "kiosks");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
