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

- No **Meu espaço**, a ação **🖨️ Imprimir** (admin) abre um diálogo:
  digite o texto → **Imprimir**.
- O texto é enviado à impressora configurada (`MG3110`).

## 4. API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/print` | Lista impressoras do CUPS (admin) |
| POST | `/api/v1/print` | Imprime texto (admin) |

`POST /api/v1/print`:

```json
{ "text": "Olá, HomeServer!" }
```

```json
{ "ok": true, "data": { "ok": true } }
```

- `text` (obrigatório) — conteúdo a imprimir.
- `printer` (opcional) — nome da impressora (padrão `MG3110`).
- A impressão roda no host via nsenter (o container da API não acessa o CUPS).

## 5. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Job "Sending data" lento | render do driver (raster) | aguardar; 1ª página ~50s |
| Nada imprime | impressora em erro (tinta/papel) | verificar luzes e papel |
| `lp: The printer or class does not exist` | impressora não configurada | repetir a etapa 2 |
