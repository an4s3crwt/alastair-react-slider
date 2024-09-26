import React, { useState, useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// Array de objetos con las imágenes y sus títulos
// Estas imágenes se mostrarán en el slider
const images = [
  { src: 'https://i.pinimg.com/564x/89/65/9b/89659baa6fa53c47213d19a341d6d5fd.jpg'},
  { src: 'https://i.pinimg.com/564x/f9/09/bd/f909bdc3d03349d77d59cb7d028dfea5.jpg'},
  { src: 'https://i.pinimg.com/564x/8b/50/63/8b50635caa2e22af236f70d633cee09d.jpg'},
  { src: 'https://i.pinimg.com/564x/a8/af/e2/a8afe2be4af66628a7e744430a6957a5.jpg'},
  { src: 'https://i.pinimg.com/564x/7e/0c/33/7e0c33b7fcb0cacb97df742115fbca0b.jpg'},
  { src: 'https://i.pinimg.com/564x/f5/08/f2/f508f241dc1ecb9c18d5661469cc05cd.jpg'}
];

const Slider = () => {
  // Estado para manejar el índice de la imagen actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Estado para guardar la última posición del mouse en el eje X
  const [lastMouseX, setLastMouseX] = useState(0);

  // Estado para cambiar la dirección de la flecha dinámica
  const [dynamicArrow, setDynamicArrow] = useState('→');

  // Función para actualizar la imagen visible en el slider
  const updateImage = (index) => {
    setCurrentIndex(index); // Cambia el índice de la imagen actual
  };

  // Función para cambiar a la siguiente imagen
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Avanza al siguiente índice, reinicia si es el último
  };

  // Función para cambiar a la imagen anterior
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Retrocede al índice anterior, reinicia si es el primero
  };

  // Función para manejar el movimiento del ratón en la pantalla
  const handleMouseMove = (e) => {
    const screenWidth = window.innerWidth; // Ancho de la pantalla
    const offsetX = e.pageX; // Posición X del ratón

    // Si el ratón está en la mitad izquierda de la pantalla, muestra ←; si no, muestra →
    setDynamicArrow(offsetX < screenWidth / 2 ? '←' : '→');

    // Mueve la flecha dinámica a la nueva posición del ratón
    const dynamicArrowElement = document.getElementById('dynamic-arrow');
    dynamicArrowElement.style.left = `${offsetX}px`; // Posición horizontal
    dynamicArrowElement.style.top = `${e.pageY}px`;  // Posición vertical
  };


  // Función para manejar los clics dentro del área del slider
  const handleSliderClick = (e) => {
    const sliderWidth = e.currentTarget.offsetWidth; // Ancho del contenedor del slider
    const offsetX = e.nativeEvent.offsetX; // Posición X del clic dentro del slider

    // Si el clic está en la mitad izquierda del slider, retrocede; si no, avanza
    if (offsetX < sliderWidth / 2) {
      prevImage(); // Cambia a la imagen anterior
    } else {
      nextImage(); // Cambia a la imagen siguiente
    }
  };

  // useEffect para manejar el evento `mousemove` y mover la flecha
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove); // Detecta el movimiento del ratón

    return () => {
      document.removeEventListener('mousemove', handleMouseMove); // Limpia el evento al desmontar el componente
    };
  }, [lastMouseX]); // Solo se ejecuta cuando `lastMouseX` cambia

  // useEffect para integrar PhotoSwipeLightbox cuando se hace clic en una imagen
  useEffect(() => {
    const imageElement = document.getElementById('slider-image'); // Selecciona la imagen actual del slider
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#slider', // ID del contenedor del slider
      children: 'img', // Solo imágenes dentro del contenedor
      pswpModule: () => import('photoswipe') // Carga dinámica de PhotoSwipe
    });



    // Limpia el lightbox al desmontar el componente
    return () => {
      lightbox.destroy(); // Elimina el lightbox cuando el componente se desmonta
    };
  }, [currentIndex]); // Se ejecuta cuando `currentIndex` cambia

  return (
    <div className="slider-container" id="slider" onClick={handleSliderClick}>

      <div className="close-btn" id="close" onClick={() => window.close()}>[ X ]</div>

      <img id="slider-image" src={images[currentIndex].src} alt={`Slider ${currentIndex}`} />

      {/* Contador de imágenes, muestra el índice actual y el total */}
      <div className="image-count" id="image-count">
        {currentIndex + 1} / {images.length}
      </div>

      
      <div className="footer-text">Ana's Secret</div>

      <div className="dynamic-arrow" id="dynamic-arrow">{dynamicArrow}</div>
    </div>
  );
};

export default Slider;
