using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PropFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDailyActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailyActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LandlordId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Contacts = table.Column<int>(type: "int", nullable: false),
                    Conversations = table.Column<int>(type: "int", nullable: false),
                    LeadsAdded = table.Column<int>(type: "int", nullable: false),
                    AppointmentsSet = table.Column<int>(type: "int", nullable: false),
                    AppointmentsMet = table.Column<int>(type: "int", nullable: false),
                    AgreementsSigned = table.Column<int>(type: "int", nullable: false),
                    OffersWritten = table.Column<int>(type: "int", nullable: false),
                    LeadGenHours = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    Notes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyActivities_Landlords_LandlordId",
                        column: x => x.LandlordId,
                        principalTable: "Landlords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DailyActivities_LandlordId_Date",
                table: "DailyActivities",
                columns: new[] { "LandlordId", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyActivities");
        }
    }
}
