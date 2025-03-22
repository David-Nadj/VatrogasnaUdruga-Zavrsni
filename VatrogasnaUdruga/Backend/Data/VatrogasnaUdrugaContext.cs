using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using VatrogasnaUdruga.Backend.Models;

namespace VatrogasnaUdruga.Backend.Data;

public partial class VatrogasnaUdrugaContext : DbContext
{
    public VatrogasnaUdrugaContext()
    {
    }

    public VatrogasnaUdrugaContext(DbContextOptions<VatrogasnaUdrugaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Oprema> Opremas { get; set; }

    public virtual DbSet<OpremaSkladista> OpremaSkladistas { get; set; }

    public virtual DbSet<OpremaSpremnika> OpremaSpremnikas { get; set; }

    public virtual DbSet<OpremaVatrogasca> OpremaVatrogascas { get; set; }

    public virtual DbSet<Skladiste> Skladistes { get; set; }

    public virtual DbSet<Spremnik> Spremniks { get; set; }

    public virtual DbSet<SpremnikVozila> SpremnikVozilas { get; set; }

    public virtual DbSet<Vatrogasac> Vatrogasacs { get; set; }

    public virtual DbSet<Vozila> Vozilas { get; set; }

    public virtual DbSet<VrstaOpreme> VrstaOpremes { get; set; }

    public virtual DbSet<VrstaVozila> VrstaVozilas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Croatian_CI_AS");

        modelBuilder.Entity<Oprema>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__oprema__3E8DFF1066893DE2");

            entity.ToTable("oprema");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.DatumKrajaValjanosti).HasColumnName("datumKrajaValjanosti");
            entity.Property(e => e.DatumProvjereValjanosti).HasColumnName("datumProvjereValjanosti");
            entity.Property(e => e.Naziv)
                .HasMaxLength(70)
                .IsUnicode(false)
                .HasColumnName("naziv");
            entity.Property(e => e.Opis)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("opis");
            entity.Property(e => e.VrstaOpremeSifra).HasColumnName("vrstaOpremeSifra");

            entity.HasOne(d => d.VrstaOpremeSifraNavigation).WithMany(p => p.Opremas)
                .HasForeignKey(d => d.VrstaOpremeSifra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__oprema__vrstaOpr__43D61337");
        });

        modelBuilder.Entity<OpremaSkladista>(entity =>
        {

            entity.HasKey(e => e.Sifra).HasName("PK__opremaSk__3E8DFF10F0B15A42");
            entity.ToTable("opremaSkladista");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.Kolicina).HasColumnName("kolicina");
            entity.Property(e => e.SifraOpreme).HasColumnName("sifraOpreme");
            entity.Property(e => e.SifraSkladista).HasColumnName("sifraSkladista");

            entity.HasOne(d => d.SifraOpremeNavigation).WithMany()
                .HasForeignKey(d => d.SifraOpreme)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__opremaSkl__sifra__4F47C5E3");

            entity.HasOne(d => d.SifraSkladistaNavigation).WithMany()
                .HasForeignKey(d => d.SifraSkladista)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__opremaSkl__sifra__4E53A1AA");
        });

        modelBuilder.Entity<OpremaSpremnika>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__opremaSp__3E8DFF104D8B239D");
            entity.ToTable("opremaSpremnika");

            entity.Property(e => e.Kolicina).HasColumnName("kolicina");
            entity.Property(e => e.SifraOpreme).HasColumnName("sifraOpreme");
            entity.Property(e => e.SifraSpremnika).HasColumnName("sifraSpremnika");

            entity.HasOne(d => d.SifraOpremeNavigation).WithMany()
                .HasForeignKey(d => d.SifraOpreme)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__opremaSpr__sifra__55009F39");

            entity.HasOne(d => d.SifraSpremnikaNavigation).WithMany()
                .HasForeignKey(d => d.SifraSpremnika)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__opremaSpr__sifra__540C7B00");
        });

        modelBuilder.Entity<OpremaVatrogasca>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__opremaVa__3E8DFF1025D1D6B6");
            entity.ToTable("opremaVatrogasca");

            entity.Property(e => e.Kolicina).HasColumnName("kolicina");
            entity.Property(e => e.SifraOpreme).HasColumnName("sifraOpreme");
            entity.Property(e => e.SifraVatrogasca).HasColumnName("sifraVatrogasca");

            entity.HasOne(d => d.SifraOpremeNavigation).WithMany()
                .HasForeignKey(d => d.SifraOpreme)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__opremaVat__sifra__498EEC8D");

            entity.HasOne(d => d.SifraVatrogascaNavigation).WithMany()
                .HasForeignKey(d => d.SifraVatrogasca)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__opremaVat__sifra__489AC854");
        });

        modelBuilder.Entity<Skladiste>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__skladist__3E8DFF1029653E3B");

            entity.ToTable("skladiste");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.Adresa)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("adresa");
            entity.Property(e => e.Naziv)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("naziv");
        });

        modelBuilder.Entity<Spremnik>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__spremnik__3E8DFF100C1E309D");

            entity.ToTable("spremnik");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.Naziv)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("naziv");
        });

        modelBuilder.Entity<SpremnikVozila>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__spremnik__3E8DFF10C930B871");
            entity.ToTable("spremnikVozila");

            entity.Property(e => e.SifraSpremnika).HasColumnName("sifraSpremnika");
            entity.Property(e => e.SifraVozila).HasColumnName("sifraVozila");

            entity.HasOne(d => d.SifraSpremnikaNavigation).WithMany()
                .HasForeignKey(d => d.SifraSpremnika)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__spremnikV__sifra__57DD0BE4");

            entity.HasOne(d => d.SifraVozilaNavigation).WithMany()
                .HasForeignKey(d => d.SifraVozila)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__spremnikV__sifra__58D1301D");
        });

        modelBuilder.Entity<Vatrogasac>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__vatrogas__3E8DFF10F3C67385");

            entity.ToTable("vatrogasac");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.BrojTelefona)
                .HasMaxLength(22)
                .IsUnicode(false)
                .HasColumnName("brojTelefona");
            entity.Property(e => e.GodinaRodenja).HasColumnName("godinaRodenja");
            entity.Property(e => e.Ime)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("ime");
            entity.Property(e => e.Prezime)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("prezime");
        });

        modelBuilder.Entity<Vozila>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__vozila__3E8DFF10BBE2C840");

            entity.ToTable("vozila");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.BrojSjedala).HasColumnName("brojSjedala");
            entity.Property(e => e.DatumProizvodnje).HasColumnName("datumProizvodnje");
            entity.Property(e => e.DatumZadnjeRegistracije).HasColumnName("datumZadnjeRegistracije");
            entity.Property(e => e.Naziv)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("naziv");
            entity.Property(e => e.Registracija)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("registracija");
            entity.Property(e => e.VrstaVozilaSifra).HasColumnName("vrstaVozilaSifra");

            entity.HasOne(d => d.VrstaVozilaSifraNavigation).WithMany(p => p.Vozilas)
                .HasForeignKey(d => d.VrstaVozilaSifra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__vozila__vrstaVoz__3F115E1A");
        });

        modelBuilder.Entity<VrstaOpreme>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__vrstaOpr__3E8DFF10228902CC");

            entity.ToTable("vrstaOpreme");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.Vrsta)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("vrsta");
        });

        modelBuilder.Entity<VrstaVozila>(entity =>
        {
            entity.HasKey(e => e.Sifra).HasName("PK__vrstaVoz__3E8DFF100759B9C9");

            entity.ToTable("vrstaVozila");

            entity.Property(e => e.Sifra).HasColumnName("sifra");
            entity.Property(e => e.Vrsta)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("vrsta");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
