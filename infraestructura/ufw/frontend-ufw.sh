
#!/bin/bash

# ==========================================
# ZERO TRUST - UFW FRONTEND
# Configuracion de firewall en Ubuntu
# ==========================================

set -euo pipefail

# ==========================================
# VALIDAR IP DE ADMINISTRACION
# ==========================================

# Ejemplo futuro:
# sudo bash frontend-ufw.sh 203.0.113.10/32

if [ "$#" -ne 1 ]; then
    echo "ERROR: Debes indicar tu IP de administracion."
    echo "Uso: sudo bash frontend-ufw.sh IP_PUBLICA/32"
    exit 1
fi

ADMIN_CIDR="$1"

# Verificar permisos de administrador
if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: Ejecuta este script con sudo."
    exit 1
fi

# ==========================================
# POLITICAS GENERALES
# ==========================================

# Bloquear conexiones entrantes
ufw default deny incoming

# Permitir conexiones salientes
ufw default allow outgoing

# ==========================================
# ACCESO SSH RESTRINGIDO
# ==========================================

# Solo permitir SSH desde nuestra IP
ufw allow from "$ADMIN_CIDR" to any port 22 proto tcp

# ==========================================
# SERVICIOS WEB
# ==========================================

# HTTP para Certbot y redireccion HTTPS
ufw allow 80/tcp

# HTTPS para conexiones seguras
ufw allow 443/tcp

# ==========================================
# REGISTROS DEL FIREWALL
# ==========================================

ufw logging on

# ==========================================
# VERIFICACION
# ==========================================

echo "======================================"
echo " ZERO TRUST - UFW FRONTEND"
echo "======================================"

echo "Reglas preparadas correctamente."
echo "SSH permitido desde: $ADMIN_CIDR"

ufw status verbose

echo "======================================"
echo "IMPORTANTE:"
echo "El script NO activa UFW automaticamente."
echo "Verifica primero tu acceso SSH."
echo "Luego habilitaremos UFW manualmente."
echo "======================================"
