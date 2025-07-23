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
