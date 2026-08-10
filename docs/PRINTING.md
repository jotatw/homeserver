# Impressão

> O HomeServer imprime via **CUPS** do host. A impressora é configurada uma
> única vez; depois, o App envia texto para imprimir pela API.

## 1. Pré-requisitos

- Impressora conectada ao servidor (USB) e detectada:
  ```bash
  lsusb        # ex.: Canon, Inc. PIXMA MG3110 Series
  ```

## 2. Configurar a impressora no CUPS (uma vez)

Com CUPS ativo (`systemctl is-active cups`), adicione a impressora:

```bash
# Descubra o device USB e o driver
sudo /usr/lib/cups/backend/usb
sudo lpinfo -m | grep -i <modelo>

# Adicione (exemplo: Canon MG3110 com Gutenprint)
sudo lpadmin -p MG3110 -E \
  -v "usb://Canon/G3010%20series?serial=9166A8&interface=1" \
  -m gutenprint.5.3://bjc-PIXMA-MG3110/expert \
  -o media=A4
```

Verifique:

```bash
lpstat -p -d
# printer MG3110 is idle. enabled ...
```

Teste:

```bash
echo "teste" | lp -d MG3110
```

> Dica: se o nome do firmware diferir do modelo (ex.: firmware "G3010" para
> uma MG3110), o device URI do `lpinfo`/backend prevalece.

## 3. Uso no App

- A tela **🖨️ Impressão** (Admin) reúne tudo:
  - **Configurações**: impressora, cor (colorida/PB), papel (A4/A5/Letter/Legal),
    orientação (retrato/paisagem) e intervalo de páginas (ex.: `1-3`).
  - **Conteúdo**: texto livre **ou** envio de arquivo (PDF, TXT, PNG, JPG).
  - Botão **Imprimir**.
- Acesso rápido: no **Meu espaço**, a ação **🖨️ Imprimir** abre a tela.
- No mobile, a tela fica no menu **＋** → Impressão.

## 4. API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/print` | Lista impressoras do CUPS (admin) |
| POST | `/api/v1/print` | Imprime texto ou arquivo (admin) |

`POST /api/v1/print`:

```json
{
  "text": "Olá, HomeServer!",
  "printer": "MG3110",
  "color": "mono",
  "media": "A4",
  "pages": "1-3",
  "orientation": "portrait"
}
```

Ou com arquivo (base64):

```json
{
  "file": { "name": "nota.pdf", "data": "<base64>" },
  "color": "color",
  "media": "A4"
}
```

| Campo | Descrição |
|---|---|
| `text` | Texto a imprimir (obrigatório se não houver `file`) |
| `file` | `{name, data(base64)}` — arquivo a imprimir |
| `printer` | Nome da impressora (padrão `MG3110`) |
| `color` | `color` (padrão) ou `mono` |
| `media` | Papel: `A4` (padrão), `A5`, `Letter`, `Legal` |
| `pages` | Intervalo de páginas (ex.: `1-3`) |
| `orientation` | `portrait` (padrão) ou `landscape` |

- Executado no host via nsenter (o container da API não acessa o CUPS).

## 5. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Job "Sending data" lento | render do driver (raster) | aguardar; 1ª página ~50s |
| Nada imprime | impressora em erro (tinta/papel) | verificar luzes e papel |
| `lp: The printer or class does not exist` | impressora não configurada | repetir a etapa 2 |
