from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
# IMPORTANTÍSIMO: Permite que tu app de React se conecte a Python sin bloqueos de seguridad
CORS(app)

# ========================================================
# FUNCIÓN AUXILIAR PARA CONECTAR A POSTGRESQL
# ========================================================
def obtener_conexion_db():
    return psycopg2.connect(
        host="localhost",
        user="postgres",         # Tu usuario por defecto de Postgres
        password="diegoberrocalqj821", # !!! CAMBIA ESTO POR TU CONTRASEÑA REAL DE PGADMIN !!!
        database="caja-ica",     # El nombre exacto de tu BD en pgAdmin
        port="5432"              # Puerto estándar de Postgres
    )

# ========================================================
# 1. RUTA PARA INICIAR SESIÓN (LOGIN)
# ========================================================
@app.route('/api/login', methods=['POST'])
def login():
    datos = request.json
    dni = datos.get('dni')
    password = datos.get('password')

    if not dni or not password:
        return jsonify({"mensaje": "DNI y contraseña son obligatorios"}), 400

    try:
        conexion = obtener_conexion_db()
        cursor = conexion.cursor()

        # Buscamos al usuario por su DNI y Contraseña
        cursor.execute("SELECT nombre, dni, saldo, intereses FROM usuarios WHERE dni = %s AND password = %s;", (dni, password))
        usuario = cursor.fetchone()

        cursor.close()
        conexion.close()

        if usuario:
            # Si se encuentra el usuario, devolvemos sus datos reales de la BD
            return jsonify({
                "nombre": usuario[0],
                "dni": usuario[1],
                "saldo": float(usuario[2]), # Convertimos el tipo NUMERIC de Postgres a float para React
                "intereses": float(usuario[3])
            }), 200
        else:
            # Si los datos no coinciden
            return jsonify({"mensaje": "El DNI o la contraseña son incorrectos."}), 401

    except Exception as error:
        print("Error en el Login:", error)
        return jsonify({"mensaje": "Error interno del servidor al conectar con la base de datos."}), 500


# ========================================================
# 2. RUTA PARA CREAR CUENTAS PERSONALES (REGISTRO)
# ========================================================
@app.route('/api/registro', methods=['POST'])
def registrar_usuario():
    datos = request.json
    dni = datos.get('dni')
    nombre = datos.get('nombre')
    password = datos.get('password')

    # Validamos que no envíen campos vacíos
    if not dni or not nombre or not password:
        return jsonify({"mensaje": "Todos los campos son obligatorios."}), 400

    if len(dni) != 8:
        return jsonify({"mensaje": "El DNI debe tener exactamente 8 dígitos."}), 400

    try:
        conexion = obtener_conexion_db()
        cursor = conexion.cursor()

        # Verificamos primero si el DNI ya está registrado para no romper la llave primaria
        cursor.execute("SELECT dni FROM usuarios WHERE dni = %s;", (dni,))
        if cursor.fetchone():
            cursor.close()
            conexion.close()
            return jsonify({"mensaje": "Este número de DNI ya está registrado en el banco."}), 400

        # Insertamos el nuevo cliente. Le regalamos un saldo inicial de S/ 100.00 y 0.00 de intereses
        consulta_insertar = """
            INSERT INTO usuarios (dni, nombre, password, saldo, intereses) 
            VALUES (%s, %s, %s, %s, %s);
        """
        valores = (dni, nombre, password, 100.00, 0.00)
        
        cursor.execute(consulta_insertar, valores)
        conexion.commit() # Guarda físicamente el nuevo registro en tu pgAdmin

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "Cuenta creada exitosamente en PostgreSQL."}), 201

    except Exception as error:
        print("Error en el Registro:", error)
        return jsonify({"mensaje": "Error interno del servidor al procesar el registro."}), 500


# ========================================================
# ARRANQUE DEL SERVIDOR EN EL PUERTO 5000
# ========================================================
if __name__ == '__main__':
    # Corre en el puerto 5000 que es el que configuramos en los fetch de React
    app.run(debug=True, port=5000)