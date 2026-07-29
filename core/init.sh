#!/usr/bin/env bash

source "$(dirname "${BASH_SOURCE[0]}")/bootstrap.sh" || return 1

_load_infrastructure || return 1
_load_components || return 1
_load_provisioning || return 1
_load_applications || return 1

return 0