using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PropFlow.Domain.Entities;

namespace PropFlow.Infrastructure.Configurations;

public class DailyActivityConfiguration : IEntityTypeConfiguration<DailyActivity>
{
    public void Configure(EntityTypeBuilder<DailyActivity> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Date).IsRequired();
        builder.Property(a => a.LeadGenHours).HasPrecision(5, 2);
        builder.Property(a => a.Notes).HasMaxLength(2000);

        builder.HasOne(a => a.Landlord)
            .WithMany()
            .HasForeignKey(a => a.LandlordId)
            .OnDelete(DeleteBehavior.Cascade);

        // One record per agent per day.
        builder.HasIndex(a => new { a.LandlordId, a.Date }).IsUnique();
    }
}
