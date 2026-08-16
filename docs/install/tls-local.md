# TLS local — instalar a CA nos dispositivos

O HomeServer usa uma **CA interna** (`/srv/config/tls/ca.pem`) para gerar os
certificados de `https://homeserver.local` e `https://<IP-da-LAN>`.

Os navegadores só confiam nos certificados depois que você instala essa CA no
dispositivo — **uma única vez por aparelho**. Feito isso, nenhuma página do
HomeServer volta a exibir o aviso "não seguro".

Os certificados expiram e são renovados automaticamente (sempre com a mesma
CA), então a instalação é definitiva até a CA ser rotacionada.

---

## Baixar a CA

Abra no navegador, ou via terminal:

```
http://192.168.0.10/hs-ca.pem
```

(ou `http://homeserver.local/hs-ca.pem`). Salve o arquivo como `hs-ca.pem`.

> O download é servido apenas por HTTP justamente para ser possível acessá-lo
> **antes** de confiar no HTTPS. Depois de instalar a CA, o acesso passa a ser
> todo sobre HTTPS.

---

## Linux (Debian/Ubuntu)

```bash
sudo cp hs-ca.pem /usr/local/share/ca-certificates/homeserver-local.crt
sudo update-ca-certificates
```

Teste:

```bash
curl https://homeserver.local/ -I
```

---

## Windows

1. Duplo clique em `hs-ca.pem` → **Instalar certificado**.
2. Selecione **Máquina local** → **Avançar**.
3. Escolha *Colocar todos os certificados no repositório a seguir* →
   **Autoridades de Certificação Raiz Confiáveis** → **Concluir**.
4. Reinicie o navegador (Chrome/Edge) e abra `https://homeserver.local`.

---

## macOS

1. Abra `hs-ca.pem` → o app **Acesso às Chaves**/Keychain.
2. Adicione em **Sistema**; depois, em *Certificados*, clique duas vezes na CA.
3. Em **Confiança → Ao usar este certificado**, marque **Confiar sempre**.
4. Saia e reabra o navegador (Safari/Chrome).

---

## Android

1. Faça o download de `hs-ca.pem`.
2. **Configurações → Segurança → Criptografia e credenciais →
   Instalar certificado → Certificado de CA**.
3. Selecione o arquivo baixado e confirme.

> No Chrome, o alerta pode continuar se voce usou o site sem a CA antes:
> **Configurações do site → Limpar dados** e recarregue.

---

## iOS / iPadOS

1. Baixe `hs-ca.pem` (via Ajustes não navega arquivos; use o Safari).
2. **Ajustes → Geral → Perfil baixado** → instale o perfil.
3. **Ajustes → Geral → Informações → Configurações de confiança de
   certificados** → ative a confiança total na CA do HomeServer.
4. Safari: recarregue `https://homeserver.local`.

---

## Verificar

Depois da instalação, estes endereços abrem sem aviso:

- `https://homeserver.local`
- `https://192.168.0.10`

## Gerenciar a CA no servidor

```bash
hs tls init    # garante CA + certificado (idempotente)
hs tls renew   # renova se faltarem <30 dias e recarrega o proxy
hs tls status  # estado legível
hs tls info    # resumo JSON
```

A renovação semanal é automática (tarefa `tls-renew` do scheduler).