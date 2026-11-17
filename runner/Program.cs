using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.Win32;

const string AllowedOrigin = "https://moon3doficial-netizen.github.io";
const int Port = 47831;
const string Prefix = "http://127.0.0.1:47831/";

if (!OperatingSystem.IsWindows())
{
    Console.WriteLine("O NEXUS PC Runner funciona somente no Windows.");
    return;
}

using var listener = new HttpListener();
listener.Prefixes.Add(Prefix);

try
{
    listener.Start();
}
catch (HttpListenerException ex)
{
    Console.WriteLine($"Não foi possível iniciar o Runner: {ex.Message}");
    Console.WriteLine("Verifique se a porta 47831 já está em uso.");
    Console.ReadKey();
    return;
}

Console.Title = "NEXUS PC Runner";
Console.WriteLine("NEXUS PC Runner iniciado.");
Console.WriteLine($"Endereço local: {Prefix}");
Console.WriteLine("Este protótipo apenas informa o estado do computador.");
Console.WriteLine("Nenhum comando de execução de programas está habilitado.");
Console.WriteLine("Mantenha esta janela aberta enquanto usar o NEXUS PC.");
Console.WriteLine();

while (listener.IsListening)
{
    HttpListenerContext context;
    try { context = await listener.GetContextAsync(); }
    catch (HttpListenerException) { break; }
    _ = Task.Run(() => HandleRequestAsync(context));
}

static async Task HandleRequestAsync(HttpListenerContext context)
{
    var request = context.Request;
    var response = context.Response;
    try
    {
        var origin = request.Headers["Origin"];
        var host = request.Headers["Host"] ?? "";

        if (!string.Equals(origin, AllowedOrigin, StringComparison.OrdinalIgnoreCase) ||
            !host.StartsWith("127.0.0.1:47831", StringComparison.OrdinalIgnoreCase))
        {
            response.StatusCode = (int)HttpStatusCode.Forbidden;
            await WriteJsonAsync(response, new { error = "Origem não autorizada." });
            return;
        }

        response.Headers["Access-Control-Allow-Origin"] = AllowedOrigin;
        response.Headers["Vary"] = "Origin";
        response.Headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
        response.Headers["Access-Control-Allow-Headers"] = "Content-Type";
        response.Headers["Access-Control-Allow-Private-Network"] = "true";

        if (request.HttpMethod == "OPTIONS")
        {
            response.StatusCode = (int)HttpStatusCode.NoContent;
            return;
        }

        if (request.HttpMethod != "GET")
        {
            response.StatusCode = (int)HttpStatusCode.MethodNotAllowed;
            await WriteJsonAsync(response, new { error = "Método não permitido." });
            return;
        }

        var path = request.Url?.AbsolutePath;
        if (path == "/health")
        {
            await WriteJsonAsync(response, new
            {
                name = "NEXUS PC Runner",
                status = "online",
                version = "0.1.0",
                mode = "local-read-only"
            });
            return;
        }

        if (path == "/system")
        {
            await WriteJsonAsync(response, GetSystemInfo());
            return;
        }

        response.StatusCode = (int)HttpStatusCode.NotFound;
        await WriteJsonAsync(response, new { error = "Rota não encontrada." });
    }
    catch (Exception ex)
    {
        try
        {
            response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await WriteJsonAsync(response, new { error = "Erro interno.", detail = ex.Message });
        }
        catch { }
    }
    finally { response.Close(); }
}

static object GetSystemInfo()
{
    var memory = new NativeMethods.MemoryStatusEx
    {
        Length = (uint)System.Runtime.InteropServices.Marshal.SizeOf<NativeMethods.MemoryStatusEx>()
    };
    NativeMethods.GlobalMemoryStatusEx(ref memory);

    string? cpuName = null;
    try
    {
        using var key = Registry.LocalMachine.OpenSubKey(@"HARDWARE\DESCRIPTION\System\CentralProcessor\0");
        cpuName = key?.GetValue("ProcessorNameString")?.ToString()?.Trim();
    }
    catch { }

    return new
    {
        computerName = Environment.MachineName,
        operatingSystem = Environment.OSVersion.VersionString,
        architecture = Environment.Is64BitOperatingSystem ? "64 bits" : "32 bits",
        processor = cpuName ?? "Não identificado",
        logicalProcessors = Environment.ProcessorCount,
        totalMemoryGb = Math.Round(memory.TotalPhysical / 1024d / 1024d / 1024d, 1),
        availableMemoryGb = Math.Round(memory.AvailablePhysical / 1024d / 1024d / 1024d, 1)
    };
}

static async Task WriteJsonAsync(HttpListenerResponse response, object data)
{
    response.ContentType = "application/json; charset=utf-8";
    response.Headers["Cache-Control"] = "no-store";
    var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(data));
    response.ContentLength64 = bytes.Length;
    await response.OutputStream.WriteAsync(bytes);
}

static class NativeMethods
{
    [System.Runtime.InteropServices.StructLayout(System.Runtime.InteropServices.LayoutKind.Sequential)]
    public struct MemoryStatusEx
    {
        public uint Length;
        public uint MemoryLoad;
        public ulong TotalPhysical;
        public ulong AvailablePhysical;
        public ulong TotalPageFile;
        public ulong AvailablePageFile;
        public ulong TotalVirtual;
        public ulong AvailableVirtual;
        public ulong AvailableExtendedVirtual;
    }

    [System.Runtime.InteropServices.DllImport("kernel32.dll", SetLastError = true)]
    [return: System.Runtime.InteropServices.MarshalAs(System.Runtime.InteropServices.UnmanagedType.Bool)]
    public static extern bool GlobalMemoryStatusEx(ref MemoryStatusEx buffer);
}
