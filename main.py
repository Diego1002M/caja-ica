from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REEMPLAZA ESTO CON TUS DATOS DE SUPABASE
SUPABASE_URL = "AQUI_VA_TU_URL"
SUPABASE_KEY = "AQUI_VA_TU_KEY"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(data: LoginRequest):
    response = supabase.table("usuarios").select("*").eq("username", data.username).execute()
    
    if not response.data or response.data[0]["password"] != data.password:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    usuario = response.data[0]
    return {
        "success": True,
        "nombre": usuario["nombre"],
        "dni": usuario["dni"],
        "saldo": usuario["saldo"]
    }