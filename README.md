# HomeServer

> Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

[![CI](https://img.shields.io/github/actions/workflow/status/jotatw/homeserver/ci.yml?branch=main&label=CI)](https://github.com/jotatw/homeserver/actions/workflows/ci.yml)
![Release](https://img.shields.io/github/v/release/jotatw/homeserver)
[![Licença](https://img.shields.io/github/license/jotatw/homeserver)](LICENSE)

## Sobre

O HomeServer transforma um computador Linux em uma plataforma local para armazenamento, serviços, usuários, automações e aplicações, administrada principalmente por uma interface web.

O projeto prioriza simplicidade, modularidade, autonomia local e facilidade de manutenção.

## v1.0.0

**Primeira release estável — 25/08/2026.**

Principais capacidades:

- HomeServer App para administração do servidor;
- armazenamento e compartilhamento de arquivos;
- usuários e autenticação próprios;
- gerenciamento de serviços e módulos;
- backup automático;
- agendamento de energia;
- gerenciamento de dispositivos;
- API REST oficial;
- HTTPS local com acesso unificado;
- CLI para automação, diagnóstico e manutenção avançada;
- testes automatizados e CI.

## Interfaces

- **App** — administração e uso cotidiano;
- **Homepage** — acesso aos serviços;
- **CLI** — automação, diagnóstico e manutenção avançada.

O uso cotidiano não exige terminal após a instalação.

## Acesso

O acesso principal é feito pela rede local:

```text
https://homeserver.local/
```

| Rota | Serviço |
|---|---|
| `/` | Homepage |
| `/app` | HomeServer App |
| `/files/` | Arquivos |
| `/git/` | Gitea |
| `/api/v1` | API |

## Instalação

### Requisitos

- Linux;
- Debian 12 é a base atualmente validada;
- acesso root ou `sudo`;
- conexão com a internet durante a instalação.

### Instalação rápida

```bash
git clone https://github.com/jotatw/homeserver.git
cd homeserver
sudo bash install.sh
```

O instalador verifica o sistema, configura o ambiente, implanta os serviços e executa as verificações necessárias para iniciar o servidor.

**Guia completo:** [`docs/install/QUICKSTART.md`](docs/install/QUICKSTART.md)

## Documentação

- [Documentação](docs/)
- [Arquitetura](docs/reference/architecture/)
- [API](api/README.md)
- [Planejamento](planning/)
- [Design do App](design/app/)
- [Guia de instalação](docs/install/QUICKSTART.md)

## Licença

MIT — consulte [`LICENSE`](LICENSE).
