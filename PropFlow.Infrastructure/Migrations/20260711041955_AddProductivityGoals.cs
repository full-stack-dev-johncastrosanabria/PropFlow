using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PropFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductivityGoals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductivityGoals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LandlordId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LeadGenHours = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    Contacts = table.Column<int>(type: "int", nullable: false),
                    Conversations = table.Column<int>(type: "int", nullable: false),
                    AppointmentsSet = table.Column<int>(type: "int", nullable: false),
                    LeadsAdded = table.Column<int>(type: "int", nullable: false),
                    AppointmentsMet = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductivityGoals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductivityGoals_Landlords_LandlordId",
                        column: x => x.LandlordId,
                        principalTable: "Landlords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ProductivityGoals_LandlordId",
                table: "ProductivityGoals",
                column: "LandlordId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductivityGoals");
        }
    }
}
