from dataclasses import dataclass
from typing import List, Optional

@dataclass
class ProyectoModel:
    id: Optional[int]
    lider_id: int
    nombre: str
    sector: str
    descripcion: str
    nivel_madurez: str
    publicado: bool = True
    estado: str = "Activo"

    def to_dict(self):
        return {
            "id": self.id,
            "lider_id": self.lider_id,
            "nombre": self.nombre,
            "sector": self.sector,
            "descripcion": self.descripcion,
            "nivel_madurez": self.nivel_madurez,
            "publicado": self.publicado,
            "estado": self.estado
        }
