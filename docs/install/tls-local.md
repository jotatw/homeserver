# HTTPS local — confiar no certificado do HomeServer

O HomeServer usa HTTPS dentro da rede local para proteger a comunicação entre seus dispositivos e o servidor.

Para isso, o servidor possui uma **CA local** em:

```text
/srv/config/tls/ca.pem
```

Essa CA é usada para assinar os certificados do HomeServer. Um dispositivo só passa a reconhecer esses certificados como confiáveis depois que a CA for instalada nele.

## Quando preciso fazer isso?

Faça a instalação da CA quando:

- o navegador mostrar um aviso de certificado ao acessar o HomeServer;
- você quiser acessar o servidor por HTTPS sem precisar ignorar avisos de segurança.

Normalmente é necessário fazer isso **uma vez em cada computador ou celular** que usará o HomeServer.

> Se a CA do servidor for substituída ou rotacionada no futuro, os dispositivos precisarão confiar na nova CA.

## Passo 1 — Baixe a CA

Abra no navegador:

```text
http://homeserver.local/hs-ca.pem
```

Se o nome `homeserver.local` não estiver disponível no dispositivo, use o endereço IP atual do servidor:

```text
http://<IP_DO_SERVIDOR>/hs-ca.pem
```

O arquivo deve ser salvo como `hs-ca.pem`.

> O download usa HTTP apenas para permitir que a CA seja obtida **antes** de o dispositivo confiar no HTTPS local. Depois da instalação, use normalmente o endereço HTTPS do HomeServer.

## Passo 2 — Instale no seu dispositivo

### Linux (Debian/Ubuntu)

```bash
sudo cp hs-ca.pem /usr/local/share/ca-certificates/homeserver-local.crt
sudo update-ca-certificates
```

Teste:

```bash
curl -I https://homeserver.local/
```

### Windows

1. Abra `hs-ca.pem`.
2. Escolha **Instalar certificado**.
3. Selecione **Máquina local**.
4. Escolha instalar em **Autoridades de Certificação Raiz Confiáveis**.
5. Conclua a instalação e reinicie o navegador.
6. Abra `https://homeserver.local/`.

### macOS

1. Abra `hs-ca.pem` com o **Acesso às Chaves**.
2. Adicione o certificado ao chaveiro **Sistema**.
3. Abra as informações da CA e, em **Confiança**, selecione **Confiar sempre**.
4. Reinicie o navegador e abra `https://homeserver.local/`.

### Android

1. Baixe `hs-ca.pem`.
2. Abra as configurações de segurança e credenciais do sistema.
3. Escolha instalar um **Certificado de CA**.
4. Selecione `hs-ca.pem` e confirme.
5. Abra novamente `https://homeserver.local/`.

Os nomes exatos dos menus podem variar conforme a versão e o fabricante do aparelho.

### iPhone e iPad

1. Baixe `hs-ca.pem` pelo navegador.
2. Abra **Ajustes → Geral → Perfil baixado** e instale o perfil.
3. Vá em **Ajustes → Geral → Sobre → Configurações de confiança de certificados**.
4. Ative a confiança para a CA do HomeServer.
5. Abra novamente `https://homeserver.local/`.

## Passo 3 — Verifique

Depois de instalar a CA, abra:

```text
https://homeserver.local/
```

O navegador deve reconhecer o certificado como confiável.

Se você utiliza o endereço IP, teste o IP **atual do seu servidor**, desde que ele esteja coberto pelo certificado configurado.

## Se ainda aparecer um aviso

Verifique, nesta ordem:

1. se você instalou a CA correta baixada do próprio HomeServer;
2. se a instalação foi feita no dispositivo que está acessando o servidor;
3. se o navegador foi reiniciado;
4. se está acessando o nome ou endereço coberto pelo certificado;
5. se a CA do servidor foi substituída desde a instalação no dispositivo.

## Gerenciar TLS no servidor

A CLI possui comandos para consultar e gerenciar o TLS:

```bash
bash core/hs.sh tls status
bash core/hs.sh tls info
bash core/hs.sh tls init
bash core/hs.sh tls renew
```

Em resumo:

| Comando | O que faz |
|---|---|
| `tls status` | Mostra o estado atual do TLS |
| `tls info` | Mostra informações resumidas |
| `tls init` | Garante que a infraestrutura TLS exista |
| `tls renew` | Executa o fluxo de renovação configurado |

A referência oficial da sintaxe disponível é sempre:

```bash
bash core/hs.sh --help
```

Voltar para [Instalar o HomeServer](README.md).