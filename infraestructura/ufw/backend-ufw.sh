
#!/bin/bash

# ==========================================
# ZERO TRUST - UFW BACKEND
# Firewall para servidor privado Ubuntu
# ==========================================

set -euo pipefail

# ==========================================
# VALIDAR EJECUCION
# ==========================================

if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: Ejecuta este script con sudo."
    exit 1
fi

# Solicitar IP privada del Frontend
if [ "$#" -ne 1 ]; then
    echo "ERROR: Debes indicar la IP privada del Frontend."
    echo "Ejemplo: sudo bash backend-ufw.sh 10.0.1.10"
    exit 1
fi

FRONTEND_IP="$1"

# Comprobar que sea una IPv4 valida
# perteneciente a la VPC Frontend

python3 - "$FRONTEND_IP" <<'PY'
import ipaddress
import sys

try:
    ip = ipaddress.IPv4Address(sys.argv[1])
    red = ipaddress.IPv4Network("10.0.0.0/18")

    if ip not in red:
        raise ValueError("IP fuera de la VPC Frontend")

except ValueError as error:
    print(f"ERROR: {error}")
    sys.exit(1)
PY

# Verificar que UFW este instalado
if ! command -v ufw >/dev/null 2>&1; then
    echo "ERROR: UFW no esta instalado."
    exit 1
fi

# ==========================================
# POLITICAS GENERALES
# ==========================================

# Bloquear conexiones entrantes
ufw default deny incoming

# Bloquear conexiones salientes
ufw default deny outgoing

# ==========================================
# COMUNICACION FRONTEND - BACKEND
# ==========================================

# Permitir solicitudes a la API REST
# solamente desde el Frontend
ufw allow from "$FRONTEND_IP" to any port 3000 proto tcp

# ==========================================
# ADMINISTRACION PRIVADA SSH
# ==========================================

# Permitir administracion SSH
# solamente desde el Frontend
ufw allow from "$FRONTEND_IP" to any port 22 proto tcp

# ==========================================
# REGISTROS DE SEGURIDAD
# ==========================================

ufw logging on

# ==========================================
# VERIFICACION
# ==========================================

echo "======================================"
echo " ZERO TRUST - UFW BACKEND"
echo "======================================"

echo "IP privada del Frontend: $FRONTEND_IP"

echo "Puerto 3000: permitido desde Frontend"
echo "Puerto 22: permitido desde Frontend"

echo "Politica entrante: DENY"
echo "Politica saliente: DENY"

echo "======================================"
echo " REGLAS CONFIGURADAS"
echo "======================================"

ufw show added
ufw status verbose

echo "======================================"
echo "IMPORTANTE:"
echo "UFW NO se activa automaticamente."
echo "Verifica primero la conexion SSH."
echo "Luego activaremos UFW manualmente."
echo "======================================"
