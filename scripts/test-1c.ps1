# Тест HTTP API 1С через gateway с твоего ПК (обход Postman ECONNRESET).
# Примеры:
#   $env:MODULE_TEAM_USER = 'Администратор'; $env:MODULE_TEAM_PASSWORD = '...'
#   .\scripts\test-1c.ps1 -Publication module.team -Path suppliers/get
#   .\scripts\test-1c.ps1 -Publication module.team -Path receipts/get -Query @{ from='01.02.2025'; to='28.02.2025' }
#   $cred = Get-Credential
#   .\scripts\test-1c.ps1 -Publication main -Path suppliers/get -Credential $cred

param(
    [ValidateSet('main', 'module.team')]
    [string]$Publication = 'module.team',

    [string]$Path = 'suppliers/get',

    [hashtable]$Query = @{},

    [string]$BaseUrl = 'https://gateway.avgst.ru',

    [PSCredential]$Credential,

    [int]$TimeoutSec = 300,

    [string]$OutFile = ''
)

$ErrorActionPreference = 'Stop'

function Get-ApiCredentialFromEnv {
    param([string]$TargetPublication)

    $userName = if ($TargetPublication -eq 'module.team') { $env:MODULE_TEAM_USER } else { $env:MAIN_USER }
    $plainPassword = if ($TargetPublication -eq 'module.team') { $env:MODULE_TEAM_PASSWORD } else { $env:MAIN_PASSWORD }

    if (-not $userName -or -not $plainPassword) {
        Write-Error @"
Укажи учётку:
  module.team: `$env:MODULE_TEAM_USER и `$env:MODULE_TEAM_PASSWORD
  main:        `$env:MAIN_USER и `$env:MAIN_PASSWORD
или параметр -Credential (Get-Credential)
"@
    }

    $securePassword = ConvertTo-SecureString $plainPassword -AsPlainText -Force
    return [PSCredential]::new($userName, $securePassword)
}

if (-not $Credential) {
    $Credential = Get-ApiCredentialFromEnv -TargetPublication $Publication
}

$networkCredential = $Credential.GetNetworkCredential()
$user = $networkCredential.UserName
$password = $networkCredential.Password

$path = $Path.TrimStart('/')
$url = "$BaseUrl/$Publication/hs/$path"

if ($Query.Count -gt 0) {
    $pairs = foreach ($key in $Query.Keys) {
        '{0}={1}' -f [uri]::EscapeDataString([string]$key), [uri]::EscapeDataString([string]$Query[$key])
    }
    $url += '?' + ($pairs -join '&')
}

$authBytes = [System.Text.Encoding]::UTF8.GetBytes("${user}:${password}")
$authHeader = 'Basic ' + [Convert]::ToBase64String($authBytes)
$password = $null

Write-Host "GET $url"
Write-Host "User: $user"
Write-Host ''

try {
    $response = Invoke-WebRequest -Uri $url -Method Get -Headers @{
        Authorization = $authHeader
    } -TimeoutSec $TimeoutSec -UseBasicParsing

    Write-Host "HTTP $($response.StatusCode)"
    Write-Host "Size: $($response.RawContentLength) bytes"
    Write-Host ''

    if ($OutFile) {
        $response.Content | Out-File -FilePath $OutFile -Encoding utf8
        Write-Host "Saved: $OutFile"
    }
    else {
        $preview = $response.Content
        if ($preview.Length -gt 4000) {
            $preview = $preview.Substring(0, 4000) + "`n... (truncated, use -OutFile for full JSON)"
        }
        Write-Host $preview
    }
}
catch {
    $ex = $_.Exception
    if ($ex.Response) {
        $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "HTTP $([int]$ex.Response.StatusCode)"
        Write-Host $body
    }
    else {
        Write-Error "Request failed: $($ex.Message)"
    }
    exit 1
}
