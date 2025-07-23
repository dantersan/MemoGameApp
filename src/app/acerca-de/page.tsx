
import React from 'react'

const page = () => {
  const desarrolladores = [
    'Gamaliel Reyes Ozuna',
    'Dante Rafael Salgado Sánchez',
    'Hiram Hernández Hernández',
    'Alejandro Jair Sevilla Salazar',
  ]

  const colaboradores = [
    'Pablo Hernández Padilla',
    'Elieze Alexis García Jiménez',
    'Yoselin Gatica Rodríguez',
    'Abraham Camacho Vargas',
    'Diego de Jesús Montiel Solís',
    'Osmar Mendoza Ramo',
  ]

  return (
    <div className="min-h-screen bg-[#3a1c2b] text-white flex items-center justify-center px-4">
      <div className="bg-[#2e1a24] p-8 rounded-2xl shadow-2xl max-w-3xl w-full text-center border border-[#5e2b3c]">
        <h1 className="text-4xl font-bold mb-8 text-[#f5e6eb]">Equipo del Juego Memorama</h1>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-[#d4a5b2] border-b border-[#5e2b3c] pb-2">Desarrolladores</h2>
          <ul className="space-y-3 text-lg">
            {desarrolladores.map((nombre, index) => (
              <li
                key={`dev-${index}`}
                className="bg-[#5e2b3c] hover:bg-[#7c3b4e] transition rounded-lg py-3 px-5 shadow-md"
              >
                {nombre}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#d4a5b2] border-b border-[#5e2b3c] pb-2">Colaboradores</h2>
          <ul className="space-y-3 text-lg">
            {colaboradores.map((nombre, index) => (
              <li
                key={`col-${index}`}
                className="bg-[#5e2b3c] hover:bg-[#7c3b4e] transition rounded-lg py-3 px-5 shadow-md"
              >
                {nombre}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default page

