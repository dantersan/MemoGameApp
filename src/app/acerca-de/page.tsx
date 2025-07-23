<<<<<<< HEAD
import React from "react";

const CreadoresPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-10 px-6">
      <section className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 mb-10">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Creadores del Proyecto
        </h1>
        <ul className="text-lg space-y-2 text-gray-800">
          <li>🎮 Pablo Hernández Padilla</li>
          <li>🎮 Elieze Alexis García Jiménez</li>
          <li>🎮 Yoselin Gatica Rodríguez</li>
          <li>🎮 Abraham Camacho Vargas</li>
          <li>🎮 Diego de Jesús Montiel Solís</li>
          <li>🎮 Osmar Mendoza Ramo</li>
        </ul>
      </section>

      <section className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Créditos - Desarrollo Web
        </h2>
        <ul className="text-md space-y-1 text-gray-700 text-center">
          <li>💻 Dante Rafael Salgado Sánchez</li>
          <li>💻 Gamaliel Reyes Ozuna</li>
          <li>💻 Hiram Hernández Hernández</li>
          <li>💻 Jair Alejandro Sevilla Salazar</li>
        </ul>
      </section>
    </main>
  );
};

export default CreadoresPage;
=======
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
>>>>>>> a0f524f68dda637a342e1c6101404f788306d1ea
