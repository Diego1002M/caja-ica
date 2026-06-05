from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CONFIGURACIÓN DE TU POSTGRESQL LOCAL
DB_PARAMS = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "diegoberrocalqj821",  
    "port": "5432"
}

# Aquí le decimos que reciba el DNI en lugar del correo
class LoginRequest(BaseModel):
    dni: str
    password: str

@app.post("/api/login")
def login(data: LoginRequest):
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Buscamos en la base de datos por la columna DNI
        query = "SELECT * FROM usuarios WHERE dni = %s"
        cursor.execute(query, (data.dni,))
        usuario = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        # Verificamos que el usuario exista y la clave sea correcta
        if not usuario or usuario["password"] != data.password:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        
        return {
            "success": True,
            "nombre": usuario["nombre"],
            "dni": usuario["dni"],
            "saldo": float(usuario["saldo"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de base de datos: {str(e)}")