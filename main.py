from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

# Permitir que tu index.html se conecte sin bloqueos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CONFIGURACIÓN DE TU POSTGRESQL LOCAL
# (Usa la contraseña que creaste cuando instalaste PostgreSQL)
DB_PARAMS = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "diegoberrocalqj821",  # <--- CAMBIA ESTO por tu clave de Postgres
    "port": "5432"
}

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(data: LoginRequest):
    try:
        # Nos conectamos a tu base de datos local
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Buscamos al usuario por su correo
        query = "SELECT * FROM usuarios WHERE username = %s"
        cursor.execute(query, (data.username,))
        usuario = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        # Verificamos si existe y si la contraseña coincide
        if not usuario or usuario["password"] != data.password:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        
        # Si todo está bien, enviamos los datos de vuelta a la página web
        return {
            "success": True,
            "nombre": usuario["nombre"],
            "dni": usuario["dni"],
            "saldo": float(usuario["saldo"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de base de datos: {str(e)}")