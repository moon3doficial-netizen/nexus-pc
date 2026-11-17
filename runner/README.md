# NEXUS PC Runner — protótipo 0.1

Este primeiro protótipo é somente de diagnóstico. Ele inicia um serviço HTTP restrito ao loopback `127.0.0.1` na porta `47831` e oferece:

- `GET /health`: informa se o Runner está ativo.
- `GET /system`: informa nome do computador, versão do Windows, arquitetura, processador e memória RAM.

**Ainda não executa aplicativos, não lê arquivos pessoais e não sincroniza arquivos.**

## Requisitos para compilar

- Windows 11 64 bits
- .NET 8 SDK (para compilar)

## Compilar um executável portátil

Abra o PowerShell nesta pasta e execute:

```powershell
dotnet publish .\NexusPcRunner.csproj -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true
```

O executável será gerado em:

`bin\Release\net8.0-windows\win-x64\publish\NexusPcRunner.exe`

Execute com dois cliques e mantenha a janela aberta enquanto testa o site.

## Segurança deste protótipo

- Escuta somente em `127.0.0.1`, não na rede local.
- Só aceita requisições GET/OPTIONS vindas da origem oficial do NEXUS PC.
- Não possui endpoint para executar comandos ou processos.
- Não contém senha, chave de serviço do Supabase ou credenciais.
- Feche a janela para desligar o serviço.

O navegador pode solicitar permissão para acessar um serviço local. Autorize somente se a solicitação vier do endereço oficial do NEXUS PC.

## Próximas etapas

1. Testar a comunicação entre o site e o Runner.
2. Adicionar pareamento local com código/token temporário.
3. Implementar uma lista fechada de operações permitidas.
4. Só então integrar downloads/cache e abertura controlada do Bambu Studio.
