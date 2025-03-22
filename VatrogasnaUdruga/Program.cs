using Microsoft.EntityFrameworkCore;
using VatrogasnaUdruga.Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<VatrogasnaUdrugaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("VatrogasnaUdrugaContext"))
);
var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(p =>
{
    p.EnableTryItOutByDefault();
    p.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
});

app.MapControllers();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseDeveloperExceptionPage();
app.MapFallbackToFile("index.html");
app.Run();